<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Seeders\userSeeder;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(userSeeder::class);
        $this->call(ServiceTypeSeeder::class);
    }
}
