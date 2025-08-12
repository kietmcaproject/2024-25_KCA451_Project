<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class role
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();

        // Check if user's role matches any of the provided roles
        if (!in_array($user->role, $roles)) {
            // Centralized redirection logic
            return $this->redirectBasedOnRole($user->role);
        }

        return $next($request);
    }

    private function redirectBasedOnRole($role)
    {
        $redirects = [
            'admin' => 'admin.dashboard',
            'user'  => 'user.dashboard',
        ];

        return redirect()->route($redirects[$role] ?? 'login');
    }
}
