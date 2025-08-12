<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Attendance;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserDashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Attendance Records (Latest 5)
        $attendanceRecords = Attendance::where('user_id', $user->id)
            ->orderBy('attendance_date', 'desc')
            ->limit(5)
            ->get();

        // Payment Records (Latest 5)
        $paymentRecords = Payment::where('user_id', $user->id)
            ->orderBy('transaction_date', 'desc')
            ->limit(5)
            ->get();

        // Expense Records (Latest 5)
        $expenseRecords = Expense::where('user_id', $user->id)
            ->orderBy('expense_date', 'desc')
            ->limit(5)
            ->get();

        // Summary Calculations
        $totalAttendance = Attendance::where('user_id', $user->id)
            ->where('status', '!=', 'A')->get()
            ->sum(function ($record) {
                return (float) $record->status;
            });
        // dd($totalAttendance);
        $totalAbsent = Attendance::where('user_id', $user->id)
            ->where('status', 'A')
            ->count(); // Count of absent days
        // dd($totalAbsent);
        $totalReceived = Payment::where('user_id', $user->id)
            ->where('action', 'receive')
            ->sum('amount');
        // dd($totalReceived);
        $totalSent = Payment::where('user_id', $user->id)
            ->where('action', 'send')
            ->sum('amount');
        // dd($totalSent);
        $totalWorkingAmount = $totalAttendance * ($user->setamount ?? 0); // Working days * daily rate
        $totalExpense = Expense::where('user_id', $user->id)->sum('amount');
        $totalProfitMinusExpense = $totalWorkingAmount + $totalReceived - $totalSent - $totalExpense;

        $summary = [
            'total_attendance' => $totalAttendance,
            'total_absent' => $totalAbsent,
            'total_received' => $totalReceived,
            'total_working_amount' => $totalWorkingAmount,
            'total_expense' => $totalExpense,
            'total_profit_minus_expense' => $totalProfitMinusExpense,
        ];

        return view('user.dashboard', compact('user', 'attendanceRecords', 'paymentRecords', 'expenseRecords', 'summary'));
    }

    public function attendance(Request $request)
    {
        $user = Auth::user();
        $month = $request->input('month', now()->month);
        $year = $request->input('year', now()->year);

        // Get all days in the selected month
        $daysInMonth = \Carbon\Carbon::create($year, $month)->daysInMonth;
        $attendanceRecords = Attendance::where('user_id', $user->id)
            ->whereYear('attendance_date', $year)
            ->whereMonth('attendance_date', $month)
            ->get();

        // Prepare data for the graph
        $attendanceData = [
            'dates' => [],
            'statuses' => []
        ];
        $totalAttendance = 0;
        $totalAbsences = 0;

        for ($day = 1; $day <= $daysInMonth; $day++) {
            $date = \Carbon\Carbon::create($year, $month, $day)->format('Y-m-d');
            $attendanceData['dates'][] = $day;
            $record = $attendanceRecords->firstWhere('attendance_date', $date);

            if ($record) {
                $attendanceData['statuses'][] = $record->status;
                if ($record->status !== 'A') {
                    $totalAttendance += (float)$record->status; // Sum numeric values
                } else {
                    $totalAbsences++;
                }
            } else {
                $attendanceData['statuses'][] = 'A'; // Absent by default
                $totalAbsences++;
            }
        }

        return view('user.attendance', compact('attendanceRecords', 'attendanceData', 'totalAttendance', 'totalAbsences'));
    }
}
