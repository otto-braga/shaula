<?php

namespace Database\Seeders;

use App\Models\Artwork;
use App\Models\Category;
use App\Models\Review;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Artwork categories
        Category::factory(10)->create([
            'class' => Artwork::class
        ]);

        // Review categories
        Category::factory(10)->create([
            'class' => Review::class
        ]);
    }
}
