<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Attendance;
use App\Models\Payment;
use App\Models\Expense;
use Illuminate\Http\Request;
use Carbon\Carbon;
use PDF;
use Illuminate\Support\Facades\Log;

class ReportController extends Controller // Extending BaseController
{
    public function index()
    {
        $users = User::where('role', 'user')
            ->select('id', 'name', 'setamount')
            ->withCount(['attendances as present_days' => fn($query) => $query->where('status', '!=', 'A')])
            ->withSum('payments as total_sent', 'amount', fn($query) => $query->where('action', 'send'))
            ->withSum('payments as total_received', 'amount', fn($query) => $query->where('action', 'receive'))
            ->withSum('expenses as total_expenses', 'amount')
            ->get();

        return view('Admin.reports.index', compact('users'));
    }

    public function show(Request $request, $userId)
    {
        return $this->generateReport($request, $userId, 'view');
    }

    public function download(Request $request, $userId)
    {
        return $this->generateReport($request, $userId, 'pdf');
    }

    protected function generateReport(Request $request, $userId, $output)
    {
        try {
            $user = User::where('role', 'user')
                ->select('id', 'name', 'email', 'contact', 'address', 'joining_date', 'setamount', 'profile_picture')
                ->findOrFail($userId);

            $user->formatted_joining_date = $user->joining_date ? Carbon::parse($user->joining_date)->format('d-M-Y') : 'N/A';
            $user->profile_pic_path = $user->profile_picture ? public_path('storage/' . $user->profile_picture) : null;

            // Use BaseController's getDateRange with 'year' as default
            $filter = $request->input('filter', 'year');
            [$startDate, $endDate] = $this->getDateRange($filter);

            // Override with custom dates if provided
            $startDate = $request->input('start_date', $startDate);
            $endDate = $request->input('end_date', $endDate);
            $formattedStartDate = Carbon::parse($startDate)->format('d-M-Y');
            $formattedEndDate = Carbon::parse($endDate)->format('d-M-Y');

            // Fetch records
            $attendanceRecords = Attendance::with('site')
                ->where('user_id', $userId)
                ->whereBetween('attendance_date', [$startDate, $endDate])
                ->orderBy('attendance_date', 'asc')
                ->get()
                ->map(function ($record) {
                    $record->formatted_date = Carbon::parse($record->attendance_date)->format('d-M-Y');
                    return $record;
                });

            $paymentRecords = Payment::where('user_id', $userId)
                ->whereBetween('transaction_date', [$startDate, $endDate])
                ->orderBy('transaction_date', 'asc')
                ->get()
                ->map(function ($record) {
                    $record->formatted_date = Carbon::parse($record->transaction_date)->format('d-M-Y');
                    return $record;
                });

            $expenseRecords = Expense::where('user_id', $userId)
                ->whereBetween('created_at', [$startDate, $endDate])
                ->orderBy('created_at', 'asc')
                ->get()
                ->map(function ($record) {
                    $record->formatted_date = Carbon::parse($record->created_at)->format('d-M-Y');
                    return $record;
                });

            // Use BaseController's calculateUserDetails for summary
            $users = User::with([
                'attendances' => fn($query) => $query->whereBetween('attendance_date', [$startDate, $endDate]),
                'expenses' => fn($query) => $query->whereBetween('created_at', [$startDate, $endDate])
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
                return view('Admin.reports.show', $data);
            }

            $pdf = PDF::loadView('Admin.reports.pdf', $data)->setPaper('A4', 'portrait');
            return $pdf->download('report_card_' . str_replace(' ', '_', $user->name) . '_' . Carbon::now()->format('Ymd_His') . '.pdf');
        } catch (\Exception $e) {
            Log::error("Error generating report for user {$userId}: " . $e->getMessage());
            return redirect()->back()->with('error', 'An error occurred while generating the report.');
        }
    }
}