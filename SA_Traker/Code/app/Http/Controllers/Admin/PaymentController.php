<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Site;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::latest()->get();
        return view('Admin.payments.index', [
            'payments' => $payments,
        ]);
    }

    public function send(Request $request)
    {
        if ($request->isMethod('get')) {
            // Admin aur users dono ko fetch karo
            $users = User::with([
                'attendances' => fn($query) => $query->where('status', '!=', 'A'),
                'expenses'
            ])->get();

            [$startDate, $endDate] = $this->getDateRange('all');
            $userDetails = $this->calculateUserDetails($users, $startDate, $endDate);

            // Remaining balances ko name ke against set karo
            $remainingBalances = $userDetails->pluck('total_profit', 'name')->all();

            return view('Admin.payments.send', [
                'users' => $users,
                'remainingBalances' => $remainingBalances,
                'countUsers' => $this->countUsers,
            ]);
        }

        $validated = $request->validate([
            'action' => 'required|in:send',
            'recipient_id' => 'required|exists:users,id',
            'payment_type' => 'required|in:earned,advance',
            'details' => 'required|string',
            'method' => 'required|in:cash,online',
            'transaction_date' => 'required|date',
            'amount' => 'required|numeric|min:0',
            'sender_type' => 'required|in:admin',
            'recipient_type' => 'required|in:user',
            'is_out_of_pocket' => 'nullable|boolean',
        ]);

        $recipient = User::findOrFail($request->recipient_id);
        [$startDate, $endDate] = $this->getDateRange('all');
        $userDetails = $this->calculateUserDetails(collect([$recipient]), $startDate, $endDate);
        $remainingAmount = $userDetails->first()['total_profit'];

        if ($request->payment_type === 'earned' && $request->amount > $remainingAmount) {
            return redirect()->back()
                ->withErrors(['amount' => "Amount exceeds the user's remaining earned amount of ₹" . number_format($remainingAmount, 2) . ". Consider marking this as an advance/loan instead."])
                ->withInput();
        }

        $paymentData = [
            'action' => $request->action,
            'sender_type' => $request->sender_type,
            'sender_name' => Auth::user()->name ?? 'Administrator',
            'recipient_type' => $request->recipient_type,
            'recipient_name' => $recipient->name,
            'payment_type' => $request->payment_type,
            'details' => $request->details,
            'method' => $request->method,
            'transaction_date' => Carbon::parse($request->transaction_date),
            'amount' => $request->amount,
            'user_id' => $request->recipient_id,
            'is_out_of_pocket' => $request->boolean('is_out_of_pocket', false),
            'is_repaid' => false,
        ];

        Log::info('Payment data before creation:', $paymentData);
        Payment::create($paymentData);

        return redirect()->route('payments.index')->with('success', 'Payment sent successfully.');
    }

    public function receive(Request $request)
    {
        if ($request->isMethod('get')) {
            $users = User::where('role', 'user')->get();
            $contractors = Site::select('contractor_name')
                            ->distinct()
                            ->pluck('contractor_name')
                            ->all();

            return view('Admin.payments.receive', [
                'users' => $users,
                'contractors' => $contractors,
                'countUsers' => $this->countUsers,
            ]);
        }

        $validated = $request->validate([
            'action' => 'required|in:receive',
            'sender_type' => 'required|in:user,contractor',
            'sender_id' => 'nullable|required_if:sender_type,user|exists:users,id',
            'sender_name' => 'nullable|required_if:sender_type,contractor|string|max:255',
            'details' => 'required|string',
            'method' => 'required|in:cash,online',
            'transaction_date' => 'required|date',
            'amount' => 'required|numeric|min:0',
            'recipient_type' => 'required|in:admin',
        ]);

        $sender_name = $request->sender_type === 'user'
            ? User::findOrFail($request->sender_id)->name
            : $request->sender_name;

        $paymentData = [
            'action' => $request->action,
            'sender_type' => $request->sender_type,
            'sender_name' => $sender_name,
            'recipient_type' => $request->recipient_type,
            'recipient_name' => Auth::user()->name ?? 'Administrator',
            'payment_type' => 'earned',
            'details' => $request->details,
            'method' => $request->method,
            'transaction_date' => Carbon::parse($request->transaction_date),
            'amount' => $request->amount,
            'user_id' => $request->sender_type === 'user' ? $request->sender_id : null,
            'is_out_of_pocket' => false,
            'is_repaid' => false,
        ];

        Log::info('Payment data before creation:', $paymentData);
        Payment::create($paymentData);

        return redirect()->route('payments.index')->with('success', 'Payment received successfully.');
    }

    public function view($id)
    {
        $payment = Payment::findOrFail($id);
        return view('Admin.payments.view', [
            'payment' => $payment,
            'countUsers' => $this->countUsers,
        ]);
    }

    public function edit($id)
    {
        $payment = Payment::findOrFail($id);
        $users = User::all();
        return view('Admin.payments.edit', [
            'payment' => $payment,
            'users' => $users,
            'countUsers' => $this->countUsers,
        ]);
    }

    public function update(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);

        $validated = $request->validate([
            'action' => 'required|in:send,receive',
            'sender_type' => 'required|in:user,contractor,admin',
            'sender_id' => 'nullable|required_if:sender_type,user|exists:users,id',
            'sender_name' => 'nullable|required_if:sender_type,contractor|string|max:255',
            'recipient_type' => 'required|in:user,admin',
            'recipient_id' => 'nullable|required_if:recipient_type,user|exists:users,id',
            'recipient_name' => 'nullable|string|max:255',
            'payment_type' => 'required|in:earned,advance,repayment',
            'details' => 'required|string',
            'method' => 'required|in:cash,online',
            'transaction_date' => 'required|date',
            'amount' => 'required|numeric|min:0',
            'is_out_of_pocket' => 'nullable|boolean',
        ]);

        $sender_name = $request->sender_type === 'user'
            ? User::findOrFail($request->sender_id)->name
            : ($request->sender_type === 'admin' ? Auth::user()->name ?? 'Administrator' : $request->sender_name);
        $recipient_name = $request->recipient_type === 'user'
            ? User::findOrFail($request->recipient_id)->name
            : ($request->recipient_type === 'admin' ? Auth::user()->name ?? 'Administrator' : $request->recipient_name);

        $paymentData = [
            'action' => $request->action,
            'sender_type' => $request->sender_type,
            'sender_name' => $sender_name,
            'recipient_type' => $request->recipient_type,
            'recipient_name' => $recipient_name,
            'payment_type' => $request->payment_type,
            'details' => $request->details,
            'method' => $request->method,
            'transaction_date' => Carbon::parse($request->transaction_date),
            'amount' => $request->amount,
            'user_id' => $request->sender_type === 'user' ? $request->sender_id : ($request->recipient_type === 'user' ? $request->recipient_id : null),
            'is_out_of_pocket' => $request->boolean('is_out_of_pocket', false),
        ];

        Log::info('Payment data before update:', $paymentData);
        $payment->update($paymentData);

        return redirect()->route('payments.index')->with('success', 'Payment updated successfully.');
    }

    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete();

        return redirect()->route('payments.index')->with('success', 'Payment deleted successfully.');
    }
}