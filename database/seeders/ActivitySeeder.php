<?php

namespace Database\Seeders;

use App\Models\Activity;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Activity::factory()->create([
            'id' => 1,
            'name' => 'autoria',
            'slug' => Str::slug('autoria'),
        ]);

        $activities = [
            'atividade-teste-1',
            'atividade-teste-2',
        ];

        foreach ($activities as $activity) {
            Activity::factory()->create(['name' => $activity, 'slug' => Str::slug($activity)]);
        }
    }
}
