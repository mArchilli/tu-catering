<?php

namespace Database\Seeders;

use App\Models\ServiceType;
use Illuminate\Database\Seeder;

class ServiceTypeSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['name' => 'Vianda', 'price_cents' => 167500],
            ['name' => 'Comedor Económico', 'price_cents' => 856900],
            ['name' => 'Comedor Premium', 'price_cents' => 913900],
        ];

        foreach ($data as $row) {
            ServiceType::updateOrCreate(['name' => $row['name']], $row);
        }
    }
}
