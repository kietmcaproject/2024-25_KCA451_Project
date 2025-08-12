<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;


class AdminProfileController extends Controller
{

    /**
     * Display the admin profile page.
     */
    public function index()
    {
        $admin = Auth::user();
        $adminData = [
            'name' => $admin->name,
            'email' => $admin->email,
            'contact' => $admin->contact,
            'address' => $admin->address,
            'profile_picture' => $admin->profile_picture ?? 'default.jpg',
            'role' => ucfirst($admin->role),
            'joining_date' => $admin->joining_date ? date('d-M-Y', strtotime($admin->joining_date)) : 'Not Set',
            'setamount' => '₹' . number_format($admin->setamount ?? 300, 2),
        ];

        return view('Admin.profile.index', compact('adminData'));
    }

    /**
     * Show the edit profile form.
     */
    public function edit()
    {
        $admin = Auth::user();
        $adminData = [
            'name' => $admin->name,
            'email' => $admin->email,
            'contact' => $admin->contact,
            'address' => $admin->address,
            'profile_picture' => $admin->profile_picture ?? 'default.jpg',
            'role' => ucfirst($admin->role),
            'joining_date' => $admin->joining_date,
            'setamount' => $admin->setamount,
        ];

        return view('Admin.profile.edit', compact('adminData'));
    }

    /**
     * Update the admin's profile.
     */
    public function update(Request $request)
    {
        $admin = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $admin->id,
            'contact' => 'required|numeric|digits:10',
            'address' => 'required|string|max:255',
            'joining_date' => 'required|date',
            'setamount' => 'required|numeric|min:0',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'password' => 'nullable|min:6|confirmed',
        ], [
            'name.required' => 'Name is required',
            'email.required' => 'Email is required',
            'email.email' => 'Enter a valid email',
            'email.unique' => 'This email is already registered',
            'contact.required' => 'Contact number is required',
            'contact.numeric' => 'Contact must be a number',
            'contact.digits' => 'Contact must be 10 digits',
            'address.required' => 'Address is required',
            'joining_date.required' => 'Joining date is required',
            'setamount.required' => 'Amount is required',
            'setamount.numeric' => 'Amount must be a number',
            'setamount.min' => 'Amount must be at least 300',
            'profile_picture.image' => 'Profile picture must be an image file',
            'profile_picture.mimes' => 'Allowed formats: jpeg, png, jpg, gif',
            'password.min' => 'Password must be at least 6 characters',
            'password.confirmed' => 'Password confirmation does not match',
        ]);

        if ($request->hasFile('profile_picture')) {
            // Delete old profile picture if it exists
            if ($admin->profile_picture && Storage::disk('public')->exists($admin->profile_picture)) {
                Storage::disk('public')->delete($admin->profile_picture);
            }
            $file = $request->file('profile_picture');
            $fileName = date('YmdHis') . '_' . $file->getClientOriginalName();
            $admin->profile_picture = $file->storeAs('profile_pictures', $fileName, 'public');
        }

        $admin->name = $validated['name'];
        $admin->email = $validated['email'];
        $admin->contact = $validated['contact'];
        $admin->address = $validated['address'];
        $admin->joining_date = $validated['joining_date'];
        $admin->setamount = $validated['setamount'];

        if ($request->filled('password')) {
            $admin->password = Hash::make($validated['password']);
        }

        $admin->save();

        return redirect()->route('admin.profile.index')->with('success', 'Profile updated successfully');
    }

    /**
     * Handle logout from all devices.
     */
    public function logout()
    {
        Auth::logout();
        return redirect()->route('login')->with('success', 'Logged out successfully');
    }
}