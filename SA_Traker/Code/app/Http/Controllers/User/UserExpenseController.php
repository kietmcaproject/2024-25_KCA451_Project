<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserExpenseController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $expenses = Expense::where('user_id', $user->id)
            ->orderBy('expense_date', 'desc')
            ->get();

        $graphData = [
            'dates' => $expenses->pluck('expense_date')->map(fn($date) => \Carbon\Carbon::parse($date)->format('d M')),
            'amounts' => $expenses->pluck('amount'),
        ];

        return view('user.expenses.index', compact('expenses', 'graphData'));
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'item_name' => 'required|string|max:255',
            'method' => 'required|in:cash,online',
            'amount' => 'required|numeric|min:0.01',
            'expense_date' => 'required|date',
        ]);

        Expense::create([
            'user_id' => $user->id,
            'item_name' => $request->item_name,
            'name' => $user->name,
            'method' => $request->method,
            'amount' => $request->amount,
            'expense_date' => $request->expense_date,
        ]);

        return redirect()->route('user.expenses.index')->with('success', 'Expense added successfully!');
    }

    // Edit: Show the edit form for a specific expense
    public function edit($id)
    {
        $user = Auth::user();
        $expense = Expense::where('id', $id)
            ->where('user_id', $user->id)
            ->where('name', $user->name) // Only self-added expenses
            ->firstOrFail();

        return view('user.expenses.edit', compact('expense'));
    }

    // Update: Save changes to an expense
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $expense = Expense::where('id', $id)
            ->where('user_id', $user->id)
            ->where('name', $user->name) // Only self-added expenses
            ->firstOrFail();

        $request->validate([
            'item_name' => 'required|string|max:255',
            'method' => 'required|in:cash,online',
            'amount' => 'required|numeric|min:0.01',
            'expense_date' => 'required|date',
        ]);

        $expense->update([
            'item_name' => $request->item_name,
            'method' => $request->method,
            'amount' => $request->amount,
            'expense_date' => $request->expense_date,
        ]);

        return redirect()->route('user.expenses.index')->with('success', 'Expense updated successfully!');
    }

    // Delete: Remove an expense
    public function destroy($id)
    {
        $user = Auth::user();
        $expense = Expense::where('id', $id)
            ->where('user_id', $user->id)
            ->where('name', $user->name) 
            ->firstOrFail();

        $expense->delete();

        return redirect()->route('user.expenses.index')->with('success', 'Expense deleted successfully!');
    }
}