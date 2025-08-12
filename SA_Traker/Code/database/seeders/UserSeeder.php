<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Create an admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'contact' => '1234567890',
            'address' => '123 Admin Street',
            'joining_date' => now(),
            'setamount' => 300,
            'profile_picture' => null,
            'role' => 'admin',
        ]);

        // Create a regular user
        User::create([
            'name' => 'Regular User',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
            'contact' => '0987654321',
            'address' => '456 User Lane',
            'joining_date' => now(),
            'setamount' => 500,
            'profile_picture' => null,
            'role' => 'user',
        ]);
    }
}