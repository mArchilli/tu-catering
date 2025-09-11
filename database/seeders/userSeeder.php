<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class userSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'aguileraod@gmail.com'],
            [
                'name' => 'Daniel',
                'password' => Hash::make('Daniel110624*'),
                'role' => 'admin',
            ]
        );
    }
}
