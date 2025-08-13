<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class ExpenseController extends Controller
{
    public function index()
    {
        $expenses = Expense::with('user')->latest()->get();
        return view('Admin.expenses.index', [
            'expenses' => $expenses,
        ]);
    }

    public function create()
    {
        // Admin ke liye saare users, non-admin ke liye khud ka data already form mein handle hoga
        $users = Auth::user()->role === 'admin' ? User::all() : collect([Auth::user()]);
        return view('Admin.expenses.create', [
            'users' => $users,
            'countUsers' => $this->countUsers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_name' => 'required|string|max:255',
            'name' => 'required|string|max:255', // Paid by
            'method' => 'required|in:cash,online',
            'expense_date' => 'required|date',
            'amount' => 'required|numeric|min:0',
            'user_id' => 'required|exists:users,id',
        ]);

        // Ensure non-admin can only assign expense to themselves
        if (Auth::user()->role !== 'admin' && $request->user_id != Auth::id()) {
            return redirect()->back()->withErrors(['user_id' => 'You can only assign expenses to yourself.']);
        }

        Expense::create($validated);

        return redirect()->route('expenses.index')->with('success', 'Expense added successfully.');
    }

    public function view($id)
    {
        $expense = Expense::with('user')->findOrFail($id);
        return view('Admin.expenses.view', [
            'expense' => $expense,
            'countUsers' => $this->countUsers,
        ]);
    }

    public function edit($id)
    {
        $expense = Expense::findOrFail($id);
        $users = Auth::user()->role === 'admin' ? User::all() : collect([Auth::user()]);
        return view('Admin.expenses.edit', [
            'expense' => $expense,
            'users' => $users,
            'countUsers' => $this->countUsers,
        ]);
    }

    public function update(Request $request, $id)
    {
        $expense = Expense::findOrFail($id);

        $validated = $request->validate([
            'item_name' => 'required|string|max:255',
            'name' => 'required|string|max:255', // Paid by
            'method' => 'required|in:cash,online',
            'expense_date' => 'required|date',
            'amount' => 'required|numeric|min:0',
            'user_id' => 'required|exists:users,id',
        ]);

        // Ensure non-admin can only update their own expenses
        if (Auth::user()->role !== 'admin' && $request->user_id != Auth::id()) {
            return redirect()->back()->withErrors(['user_id' => 'You can only update expenses assigned to yourself.']);
        }

        $expense->update($validated);

        return redirect()->route('expenses.index')->with('success', 'Expense updated successfully.');
    }

    public function destroy($id)
    {
        $expense = Expense::findOrFail($id);

        // Restrict non-admin from deleting others' expenses
        if (Auth::user()->role !== 'admin' && $expense->user_id != Auth::id()) {
            return redirect()->back()->withErrors(['error' => 'You can only delete your own expenses.']);
        }

        $expense->delete();

        return redirect()->route('expenses.index')->with('success', 'Expense deleted successfully.');
    }
}