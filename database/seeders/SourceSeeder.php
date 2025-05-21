<?php

namespace Database\Seeders;

use App\Models\Source;
use App\Models\SourceCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SourceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        SourceCategory::factory(10)->create();
        Source::factory(20)->create();
    }
}
