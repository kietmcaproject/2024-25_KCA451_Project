<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Show the login form.
     */
    public function showLoginForm()
    {
        if (Auth::check()) {
            return $this->redirectBasedOnRole(Auth::user()->role);
        }

        return view('auth.login');
    }

    /**
     * Handle login request.
     */
    public function login(Request $request)
    {
        // Validate the request
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Attempt to log the user in
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $userData = $user->only(['id', 'email', 'role']); // Pick only necessary fields
            $userData['login_time'] = now()->toDateTimeString();

            // Redirect based on role
            return $this->redirectBasedOnRole($user->role);
        }

        // Return back with error if login fails
        return back()->withErrors(['email' => 'Invalid credentials'])->withInput();
    }

    /**
     * Handle logout request.
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate(); // Clear session
        $request->session()->regenerateToken(); // Regenerate CSRF token

        return redirect()->route('login')->with('success', 'Logged out successfully.');
    }

    /**
     * Redirect based on user role.
     */
    private function redirectBasedOnRole($role)
    {
        $redirects = [
            'admin' => 'admin.dashboard',
            'user'  => 'user.dashboard',
        ];

        // If role exists in redirects array, redirect to it, otherwise unauthorized
        return redirect()->route($redirects[$role] ?? 'unauthorized');
    }
}