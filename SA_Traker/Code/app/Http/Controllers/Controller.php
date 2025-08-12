<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Payment;
use App\Models\Expense;
use App\Models\Attendance;
use App\Models\Site;
use Carbon\Carbon;
use Illuminate\Http\Request;

abstract class Controller
{
    protected $countUsers;

    public function __construct()
    {
        $this->countUsers = User::where('role', 'user')->count();
    }

    protected function getDateRange($filter)
    {
        switch ($filter) {
            case 'week':
                $startDate = Carbon::now()->startOfWeek()->toDateString();
                $endDate = Carbon::now()->endOfWeek()->toDateString();
                break;
            case 'year':
                $startDate = Carbon::now()->startOfYear()->toDateString();
                $endDate = Carbon::now()->endOfYear()->toDateString();
                break;
            case 'all':
                $startDate = Attendance::min('attendance_date') ?? Carbon::now()->subYears(10)->toDateString();
                $endDate = Carbon::now()->toDateString();
                break;
            case 'month':
            default:
                $startDate = Carbon::now()->startOfMonth()->toDateString();
                $endDate = Carbon::now()->endOfMonth()->toDateString();
                break;
        }
        return [$startDate, $endDate];
    }

    protected function calculateUserDetails($users, $startDate, $endDate)
    {
        return $users->map(function ($user) use ($startDate, $endDate) {
            $totalAttendance = $user->attendances->sum(function ($attendance) {
                return $attendance->status !== 'A' ? floatval($attendance->status) : 0;
            });

            // User/Admin ne admin se mila (admin -> user/admin, action = 'send')
            $totalReceivedMoney = Payment::where('user_id', $user->id)
                ->where('action', 'send')
                ->where('sender_type', 'admin')
                ->whereIn('recipient_type', ['user', 'admin'])
                ->whereBetween('transaction_date', [$startDate, $endDate])
                ->sum('amount');

            // User/Admin ne admin ko diya (user/admin -> admin, action = 'receive')
            $totalSentMoney = Payment::where('user_id', $user->id)
                ->where('action', 'receive')
                ->whereIn('sender_type', ['user', 'admin'])
                ->where('recipient_type', 'admin')
                ->whereBetween('transaction_date', [$startDate, $endDate])
                ->sum('amount');

            $totalExpense = $user->expenses->sum('amount');
            $setAmount = $user->setamount ?? 0;
            $calculatedIncome = $setAmount * $totalAttendance;

            // Logic: total_profit = calculated_income + sent_money - received_money - expense
            $totalProfit = $calculatedIncome + $totalSentMoney - $totalReceivedMoney - $totalExpense;

            return [
                'name' => $user->name,
                'role' => $user->role,
                'set_amount' => $setAmount,
                'total_attendance' => $totalAttendance,
                'calculated_income' => $calculatedIncome,
                'total_sent_money' => $totalSentMoney,
                'total_received_money' => $totalReceivedMoney,
                'total_expense' => $totalExpense,
                'total_profit' => $totalProfit,
            ];
        });
    }

    public function overview(Request $request)
    {
        $filter = $request->input('filter', 'all');
        [$startDate, $endDate] = $this->getDateRange($filter);

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

        $userDetails = $this->calculateUserDetails($users, $startDate, $endDate);
        $totalAttendance = $userDetails->sum('total_attendance');
        $totalWorkingSites = Site::whereHas('attendance', function ($query) use ($startDate, $endDate) {
            $query->whereBetween('attendance_date', [$startDate, $endDate])
                ->where('status', '!=', 'A');
        })->count();

        return view('Admin.overview.index', compact(
            'filter',
            'startDate',
            'endDate',
            'adminSentMoney',
            'adminReceivedMoney',
            'adminExpense',
            'adminIncome',
            'totalAttendance',
            'totalWorkingSites',
            'userDetails'
        ));
    }
}