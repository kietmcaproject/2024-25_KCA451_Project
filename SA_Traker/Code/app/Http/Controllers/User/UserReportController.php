<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Attendance;
use App\Models\Payment;
use App\Models\Expense;
use Carbon\Carbon; // Correctly imported Carbon
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf; // Use Pdf facade instead of PDF alias

class UserReportController extends Controller
{
    protected function generateReport(Request $request, $userId, $output)
    {
        try {
            $user = User::where('id', $userId)
                ->select('id', 'name', 'email', 'contact', 'address', 'joining_date', 'setamount', 'profile_picture')
                ->findOrFail($userId);

            $user->formatted_joining_date = $user->joining_date ? Carbon::parse($user->joining_date)->format('d-M-Y') : 'N/A';
            $user->profile_pic_path = $user->profile_picture ? public_path('storage/' . $user->profile_picture) : null;

            $filter = $request->input('filter', 'month');
            [$startDate, $endDate] = $this->getDateRange($filter);

            $startDate = $request->input('start_date', $startDate);
            $endDate = $request->input('end_date', $endDate);
            $formattedStartDate = Carbon::parse($startDate)->format('m/d/Y');
            $formattedEndDate = Carbon::parse($endDate)->format('m/d/Y');

            $attendanceRecords = Attendance::with('site')
                ->where('user_id', $userId)
                ->whereBetween('attendance_date', [$startDate, $endDate])
                ->orderBy('attendance_date', 'asc')
                ->get()
                ->map(function ($record) {
                    $record->formatted_date = Carbon::parse($record->attendance_date)->format('m/d/Y');
                    return $record;
                });

            $paymentRecords = Payment::where('user_id', $userId)
                ->whereBetween('transaction_date', [$startDate, $endDate])
                ->orderBy('transaction_date', 'asc')
                ->get()
                ->map(function ($record) {
                    $record->formatted_date = Carbon::parse($record->transaction_date)->format('m/d/Y');
                    return $record;
                });

            $expenseRecords = Expense::where('user_id', $userId)
                ->whereBetween('expense_date', [$startDate, $endDate])
                ->orderBy('expense_date', 'asc')
                ->get()
                ->map(function ($record) {
                    $record->formatted_date = Carbon::parse($record->expense_date)->format('m/d/Y');
                    return $record;
                });

            $users = User::with([
                'attendances' => fn($query) => $query->whereBetween('attendance_date', [$startDate, $endDate]),
                'expenses' => fn($query) => $query->whereBetween('expense_date', [$startDate, $endDate])
            ])->where('id', $userId)->get();

            $userDetails = $this->calculateUserDetails($users, $startDate, $endDate)->first();

            $siteVisits = $attendanceRecords->groupBy('site_id')->map(function ($group) {
                return [
                    'site_name' => $group->first()->site ? $group->first()->site->site_name : 'Not Assigned',
                    'days' => $group->where('status', '!=', 'A')->sum('status'),
                ];
            })->values();

            $summary = [
                'total_attendance' => $userDetails['total_attendance'],
                'total_absentees' => $attendanceRecords->where('status', 'A')->count(),
                'total_income' => $userDetails['calculated_income'],
                'total_received' => $userDetails['total_received_money'],
                'total_sent' => $userDetails['total_sent_money'],
                'total_expenses' => $userDetails['total_expense'],
                'total_profit' => $userDetails['total_profit'],
                'total_remaining' => $userDetails['calculated_income'] + $userDetails['total_sent_money'] - $userDetails['total_received_money'] - $userDetails['total_expense'],
            ];

            $data = compact(
                'user',
                'attendanceRecords',
                'paymentRecords',
                'expenseRecords',
                'siteVisits',
                'summary',
                'startDate',
                'endDate',
                'formattedStartDate',
                'formattedEndDate',
                'filter'
            );

            if ($output === 'view') {
                Log::info("Rendering user report view for user: " . $userId);
                return view('user.report.show', $data);
            }

            Log::info("Generating PDF for user: " . $userId);
            $pdf = Pdf::loadView('user.report.pdf', $data)->setPaper('A4', 'portrait');
            return $pdf->download('report_' . str_replace(' ', '_', $user->name) . '_' . Carbon::now()->format('Ymd_His') . '.pdf');
        } catch (\Exception $e) {
            Log::error("Error generating report for user {$userId}: " . $e->getMessage() . "\nStack: " . $e->getTraceAsString());
            return redirect()->route('user.dashboard')->with('error', 'Failed to load report: ' . $e->getMessage());
        }
    }

    public function show(Request $request)
    {
        $userId = Auth::id();
        return $this->generateReport($request, $userId, 'view');
    }

    public function download(Request $request)
    {
        $userId = Auth::id();
        return $this->generateReport($request, $userId, 'pdf');
    }
}