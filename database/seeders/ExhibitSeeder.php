<?php

namespace Database\Seeders;

use App\Models\Exhibit;
use Illuminate\Database\Seeder;

class ExhibitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Exhibit::factory(20)->create();
    }
}
