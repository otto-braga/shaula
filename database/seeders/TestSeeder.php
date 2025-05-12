<?php

namespace Database\Seeders;

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
        $this->call(CategorySeeder::class);
        $this->call(PeriodSeeder::class);
        $this->call(LanguageSeeder::class);
        $this->call(AwardSeeder::class);
        $this->call(PersonSeeder::class);
        $this->call(ArtworkSeeder::class);
        $this->call(ReviewSeeder::class);
        $this->call(HistoryArticleSeeder::class);
        $this->call(SourceSeeder::class);
        $this->call(MentionSeeder::class);
    }
}
