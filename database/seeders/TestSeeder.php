<?php

namespace Database\Seeders;

use App\Models\Gender;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call(GenderSeeder::class);
        $this->call(CitySeeder::class);
        $this->call(ActivitySeeder::class);
        $this->call(PersonSeeder::class);
        $this->call(ArtworkSeeder::class);
        // $this->call(ReviewSeeder::class);
    }
}
