<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Payment;
use App\Models\Expense;
use App\Models\Attendance;
use App\Models\Site;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AdminController extends Controller
{
    public function index()
    {
        // Date range for "all time" (Base Controller Method)
        [$startDate, $endDate] = $this->getDateRange('all');

        // Admin-specific data
        $adminSentMoney = Payment::where('action', 'send')
            ->where('sender_type', 'admin')
            ->whereBetween('transaction_date', [$startDate, $endDate])
            ->sum('amount');

        $adminReceivedMoney = Payment::where('action', 'receive')
            ->where('recipient_type', 'admin')
            ->whereBetween('transaction_date', [$startDate, $endDate])
            ->sum('amount');

        $adminExpense = Expense::where('user_id', 1) // Assuming admin ID is 1
            ->whereBetween('expense_date', [$startDate, $endDate])
            ->sum('amount');

        $adminIncome = $adminReceivedMoney - $adminSentMoney - $adminExpense;

        // All users including admin
        $users = User::with([
            'attendances' => fn($query) => $query->whereBetween('attendance_date', [$startDate, $endDate]),
            'expenses' => fn($query) => $query->whereBetween('expense_date', [$startDate, $endDate])
        ])->get();

        // User details (Base Controller Method)
        $userDetails = $this->calculateUserDetails($users, $startDate, $endDate);
        $pendingPayments = $userDetails->sum(function ($user) {
            return $user['total_profit'] > 0 ? $user['total_profit'] : 0;
        });

        // Today's attendance
        $today = Carbon::today()->toDateString();
        $attendances = Attendance::where('attendance_date', $today)->get();
        $presentCount = $attendances->sum(function ($attendance) {
            return is_numeric($attendance->status) ? floatval($attendance->status) : 0;
        });
        $absentCount = $attendances->where('status', 'A')->count();
        $totalUsers = User::count();
        $markedAttendanceCount = $attendances->count();
        $pendingCount = $totalUsers - $markedAttendanceCount;

        // Current working fields
        $workingFields = Site::whereHas('attendance', function ($query) use ($today) {
            $query->where('attendance_date', $today)
                ->where('status', '!=', 'A');
        })->with(['attendance' => function ($query) use ($today) {
            $query->where('attendance_date', $today)->with('user');
        }])->get()->map(function ($site) {
            $user = $site->attendance->first()->user ?? null;
            return [
                'site_name' => $site->site_name,
                'user_name' => $user ? $user->name : 'Unknown',
            ];
        });



        // Attendance Statistics
        $attendanceStats = $users->map(function ($user) use ($startDate, $endDate) {
            $absentDays = $user->attendances->where('status', 'A')->whereBetween('attendance_date', [$startDate, $endDate])->count();
            $presentDays = $user->attendances->where('status', '!=', 'A')->whereBetween('attendance_date', [$startDate, $endDate])->sum(function ($attendance) {
                return is_numeric($attendance->status) ? floatval($attendance->status) : 0;
            });
            return [
                'name' => $user->name,
                'absent_days' => $absentDays,
                'present_days' => $presentDays,
            ];
        });
        $mostAbsences = $attendanceStats->sortByDesc('absent_days')->first();
        $bestAttendance = $attendanceStats->sortByDesc('present_days')->first();

        // Payment Statistics
        $paymentStats = $userDetails->sortBy('total_profit');
        $lowestPending = $paymentStats->where('total_profit', '>', 0)->first();
        $highestPending = $paymentStats->sortByDesc('total_profit')->first();

        // Pending Actions (Using is_repaid column)
        $pendingPaymentsList = Payment::where('action', 'send')
            ->where('sender_type', 'admin')
            ->whereBetween('transaction_date', [$startDate, $endDate])
            ->where('is_repaid', false)
            ->orderBy('amount', 'desc')
            ->limit(2)
            ->get()
            ->map(function ($payment) {
                return [
                    'type' => 'Payment',
                    'name' => $payment->recipient_name,
                    'details' => $payment->details,
                    'amount' => $payment->amount,
                ];
            });

        $pendingExpenses = Expense::where('user_id', 1)
            ->whereBetween('expense_date', [$startDate, $endDate])
            ->orderBy('amount', 'desc')
            ->limit(2)
            ->get()
            ->map(function ($expense) {
                return [
                    'type' => 'Expense',
                    'name' => 'Admin',
                    'details' => $expense->details,
                    'amount' => $expense->amount,
                ];
            });

        $pendingActions = $pendingPaymentsList->merge($pendingExpenses)->sortByDesc('amount')->take(2);

        return view('admin.dashboard', [
            'countUsers' => $this->countUsers, // Base Controller Property
            'adminIncome' => $adminIncome,
            'adminExpense' => $adminExpense,
            'pendingPayments' => $pendingPayments,
            'netBalance' => $adminIncome - $adminExpense,
            'presentCount' => $presentCount,
            'absentCount' => $absentCount,
            'pendingCount' => $pendingCount >= 0 ? $pendingCount : 0,
            'workingFields' => $workingFields,
            'mostAbsences' => $mostAbsences,
            'bestAttendance' => $bestAttendance,
            'lowestPending' => $lowestPending,
            'highestPending' => $highestPending,
            'pendingActions' => $pendingActions,
        ]);
    }

    public function dashboard()
    {
        return $this->index();
    }

    public function manage()
    {
        return view('admin.manage');
    }
}
