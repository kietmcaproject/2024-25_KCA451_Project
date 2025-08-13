<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\User;
use App\Models\Site;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class AttendanceController extends Controller
{
    public function overview(Request $request)
    {
        $users = User::withCount([
            'attendance as total_present' => function ($query) {
                $query->where('status', '!=', 'A')->selectRaw('SUM(status)');
            },
            'attendance as total_absent' => function ($query) {
                $query->where('status', 'A');
            }
        ])->paginate(10);

        $userAttendanceSummaries = $users->mapWithKeys(function ($user) {
            return [$user->id => [
                'total_present' => $user->total_present ?? 0,
                'total_absent' => $user->total_absent ?? 0,
            ]];
        })->all();

        $selectedDate = now()->toDateString();
        return view('Admin.attendance.overview', compact('users', 'userAttendanceSummaries', 'selectedDate'));
    }

    public function index(Request $request)
    {
        $selectedDate = $request->input('attendance_date', now()->toDateString());
    
        if (Carbon::parse($selectedDate)->gt(now())) {
            $selectedDate = now()->toDateString();
            return redirect()->route('attendance.index', ['attendance_date' => $selectedDate])
                ->with('error', 'Cannot mark attendance for future dates.');
        }
    
        $users = User::all(); 
        $sites = Site::all();
    
        $attendanceRecords = Attendance::with('site')
            ->where('attendance_date', $selectedDate)
            ->get()
            ->keyBy('user_id');
    
        $allMarked = $users->count() > 0 && $attendanceRecords->count() === $users->count();
    
        return view('Admin.attendance.index', compact('users', 'sites', 'attendanceRecords', 'selectedDate', 'allMarked'));
    }

    public function create()
    {
        $users = User::all();
        $sites = Site::all();
        return view('Admin.attendance.create', compact('users', 'sites'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'attendance_date' => 'required|date|before_or_equal:today',
            'attendance' => 'required|array',
            'attendance.*.user_id' => 'required|exists:users,id',
            'attendance.*.status' => 'required|in:0.5,1,1.5,2,A',
            'attendance.*.site_id' => [
                'nullable',
                'exists:sites,id',
                function ($attribute, $value, $fail) use ($request) {
                    $userId = explode('.', $attribute)[1];
                    $status = $request->input("attendance.$userId.status");
                    if (in_array($status, ['0.5', '1', '1.5', '2']) && empty($value)) {
                        $fail("Site is required when status is present.");
                    }
                    if ($status === 'A' && !empty($value)) {
                        $fail("Site must be empty when status is absent (A).");
                    }
                },
            ],
        ]);

        $attendanceDate = $validated['attendance_date'];

        try {
            foreach ($validated['attendance'] as $data) {
                Attendance::updateOrCreate(
                    ['user_id' => $data['user_id'], 'attendance_date' => $attendanceDate],
                    [
                        'status' => $data['status'],
                        'site_id' => $data['status'] === 'A' ? null : $data['site_id'],
                    ]
                );
            }
            return redirect()->route('attendance.index', ['attendance_date' => $attendanceDate])
                ->with('success', 'Attendance updated successfully.');
        } catch (\Exception $e) {
            Log::error('Attendance store failed', ['error' => $e->getMessage()]);
            return back()->with('error', 'Failed to update attendance.');
        }
    }

    public function edit($id)
    {
        $attendance = Attendance::with('user', 'site')->findOrFail($id);
        $users = User::all();
        $sites = Site::all();
        return view('Admin.attendance.edit', compact('attendance', 'users', 'sites'));
    }

    public function update(Request $request, $id)
    {
        $attendance = Attendance::findOrFail($id);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'attendance_date' => 'required|date|before_or_equal:today',
            'status' => 'required|in:0.5,1,1.5,2,A',
            'site_id' => [
                'nullable',
                'exists:sites,id',
                function ($attribute, $value, $fail) use ($request) {
                    $status = $request->input('status');
                    if (in_array($status, ['0.5', '1', '1.5', '2']) && empty($value)) {
                        $fail("Site is required when status is present.");
                    }
                    if ($status === 'A' && !empty($value)) {
                        $fail("Site must be empty when status is absent (A).");
                    }
                },
            ],
        ]);

        try {
            $attendance->update([
                'user_id' => $validated['user_id'],
                'attendance_date' => $validated['attendance_date'],
                'status' => $validated['status'],
                'site_id' => $validated['status'] === 'A' ? null : $validated['site_id'],
            ]);
            return redirect()->route('attendance.view', ['userId' => $validated['user_id'], 'selectedDate' => $validated['attendance_date']])
                ->with('success', 'Attendance updated successfully.');
        } catch (\Exception $e) {
            Log::error('Attendance update failed', ['error' => $e->getMessage()]);
            return back()->with('error', 'Failed to update attendance.');
        }
    }

    public function view(Request $request, $userId, $selectedDate = null)
    {
        $user = User::findOrFail($userId);
        $filter = $request->input('filter', 'all');

        $query = Attendance::with('site')
            ->where('user_id', $userId)
            ->orderBy('attendance_date', 'desc');

        switch ($filter) {
            case 'week':
                $query->where('attendance_date', '>=', now()->subDays(7));
                break;
            case 'month':
                $query->where('attendance_date', '>=', now()->startOfMonth());
                break;
            case 'year':
                $query->where('attendance_date', '>=', now()->startOfYear());
                break;
        }

        $attendanceRecords = $query->paginate(10);

        $totalPresent = $attendanceRecords->where('status', '!=', 'A')->sum('status');
        $totalAbsent = $attendanceRecords->where('status', 'A')->count();

        return view('Admin.attendance.view', compact('user', 'attendanceRecords', 'totalPresent', 'totalAbsent', 'selectedDate', 'filter'));
    }

    public function destroy($id)
    {
        $attendance = Attendance::findOrFail($id);
        $userId = $attendance->user_id;
        $attendanceDate = $attendance->attendance_date;
        $attendance->delete();

        return redirect()->route('attendance.view', ['userId' => $userId, 'selectedDate' => $attendanceDate])
            ->with('success', 'Attendance record deleted successfully.');
    }

    public function bulkDelete(Request $request)
    {
        $request->validate(['attendance_date' => 'required|date|before_or_equal:today']);
        $date = $request->attendance_date;
        Attendance::where('attendance_date', $date)->delete();

        return redirect()->route('attendance.index', ['attendance_date' => $date])
            ->with('success', 'All attendance records for ' . Carbon::parse($date)->format('d M Y') . ' deleted.');
    }
}