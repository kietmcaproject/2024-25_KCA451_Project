<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UsersController extends Controller
{
    public function create()
    {
        return view('Admin.users.adduserform');
    }

    public function store(Request $request)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',
            'contact' => 'required|numeric|digits:10',
            'address' => 'required|string|max:255',
            'joining_date' => 'required|date',
            'setamount' => 'required|numeric|min:300',
            'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif|max:4096',
            'role' => 'required|in:user,admin',
        ];

        $messages = [
            'name.required' => 'Name is required',
            'email.required' => 'Email is required',
            'email.email' => 'Enter a valid email',
            'email.unique' => 'This email is already registered',
            'password.required' => 'Password is required',
            'password.confirmed' => 'Passwords do not match',
            'contact.required' => 'Contact number is required',
            'contact.numeric' => 'Contact must be a number',
            'contact.digits' => 'Contact must be 10 digits',
            'address.required' => 'Address is required',
            'joining_date.required' => 'Joining date is required',
            'setamount.required' => 'Salary is required',
            'profile_picture.required' => 'Profile picture is required',
            'profile_picture.image' => 'Profile picture must be an image file',
            'profile_picture.mimes' => 'Allowed formats: jpeg, png, jpg, gif',
            'profile_picture.max' => 'Profile picture size must be less than 4MB',
            'role.required' => 'Role selection is required',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return redirect()->route('add_user.create')
                ->withErrors($validator)
                ->withInput();
        }

        $profilePicturePath = null;
        if ($request->hasFile('profile_picture')) {
            $file = $request->file('profile_picture');
            $profilePicturePath = $file->store('Users','public');
        }

        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->contact = $request->contact;
        $user->address = $request->address;
        $user->joining_date = $request->joining_date;
        $user->setamount = $request->setamount;
        $user->profile_picture = $profilePicturePath;
        $user->role = $request->role;
        $user->save();

        return redirect()->route('manage_users')
            ->with('success', 'User added successfully!');
    }
    
    public function manageUsers()
    {

        $users = User::where('role', 'user')->get();
        return view('admin.users.view',[
            'users' => $users,
            'countUsers' => $this->countUsers,
        ]);
    }

    public function view($id)
    {
        $user = User::findOrFail($id);
        return view('admin.users.view', compact('user'));
    }

    public function edit($id)
    {
        $user = User::findOrFail($id);
        return view('admin.users.edit', compact('user'));
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'contact' => 'required|numeric|digits:10',
            'address' => 'required|string|max:255',
            'joining_date' => 'required|date',
            'setamount' => 'required|numeric|min:300',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'role' => 'required|in:user,admin',
        ];

        $request->validate($rules);

        if ($request->hasFile('profile_picture')) {
            if ($user->profile_picture && Storage::disk('public')->exists($user->profile_picture)) {
                Storage::disk('public')->delete($user->profile_picture);
            }
            $file = $request->file('profile_picture');
            $user->profile_picture = $file->store('Users', 'public');
        }

        $user->name = $request->name;
        $user->email = $request->email;
        $user->contact = $request->contact;
        $user->address = $request->address;
        $user->joining_date = $request->joining_date;
        $user->setamount = $request->setamount;
        $user->role = $request->role;

        if ($request->filled('password')) {
            $request->validate([
                'password' => 'required|min:6|confirmed',
            ]);
            $user->password = Hash::make($request->password);
        }

        $user->save();
        return redirect()->route('manage_users')->with('success', 'User Updated Successfully');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->profile_picture && Storage::disk('public')->exists($user->profile_picture)) {
            Storage::disk('public')->delete($user->profile_picture);
        }

        $user->delete();

        return redirect()->route('manage_users')->with('success', 'User delete Successfully');
    }
}
