<?php

namespace Database\Seeders;

use App\Models\HistoryArticle;
use Illuminate\Database\Seeder;

class HistoryArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        HistoryArticle::factory(20)->create();
    }
}
