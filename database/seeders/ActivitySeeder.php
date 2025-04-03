<?php

namespace Database\Seeders;

use App\Models\Activity;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $activities = [
            'autoria',
            'curadoria',
            'montação',
        ];

        foreach ($activities as $activity) {
            Activity::factory()->create(['name' => $activity]);
        }
    }
}
