<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserPaymentController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $users = User::all(); // Fetch all users (admin + user) for recipient dropdown
        $payments = Payment::where('sender_name', $user->name)
            ->where('action', 'send')
            ->orderBy('transaction_date', 'desc')
            ->get();

        // Prepare data for the graph
        $graphData = [
            'dates' => $payments->pluck('transaction_date')->map(fn($date) => \Carbon\Carbon::parse($date)->format('d M')),
            'amounts' => $payments->pluck('amount'),
        ];

        return view('user.payments.send_index', compact('users', 'payments', 'graphData'));
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'recipient_id' => 'required|exists:users,id',
            'payment_type' => 'required|in:earned,advance,repayment',
            'details' => 'required|string|max:255',
            'method' => 'required|in:cash,online',
            'transaction_date' => 'required|date',
            'amount' => 'required|numeric|min:0.01',
        ]);

        $recipient = User::findOrFail($request->recipient_id);

        Payment::create([
            'action' => 'send',
            'sender_type' => 'user',
            'sender_name' => $user->name,
            'recipient_type' => $recipient->role,
            'recipient_name' => $recipient->name,
            'payment_type' => $request->payment_type,
            'details' => $request->details,
            'method' => $request->method,
            'transaction_date' => $request->transaction_date,
            'amount' => $request->amount,
            'user_id' => $user->id,
            'is_out_of_pocket' => false,
            'is_repaid' => $request->payment_type === 'repayment' ? true : false,
        ]);

        return redirect()->route('user.send.index')->with('success', 'Payment sent successfully!');
    }

    // New Receive Payment Index
    public function receive()
    {
        $user = Auth::user();
        $payments = Payment::where('recipient_name', $user->name)
            ->where('action', 'receive')
            ->orderBy('transaction_date', 'desc')
            ->get();

        // Prepare data for the graph
        $graphData = [
            'dates' => $payments->pluck('transaction_date')->map(fn($date) => \Carbon\Carbon::parse($date)->format('d M')),
            'amounts' => $payments->pluck('amount'),
        ];

        return view('user.payments.receive_index', compact('payments', 'graphData'));
    }
}