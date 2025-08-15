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
            ['email' => 'admin@admin.com'],
            [
                'name' => 'Admin',
                'password' => '1234', 
                'role' => 'admin',
            ]
        );

        User::firstOrCreate(
            ['email' => 'padre@padre.com'],
            [
                'name' => 'Padre',
                'password' => '1234', 
                'role' => 'padre',
            ]
        );
    }
}
