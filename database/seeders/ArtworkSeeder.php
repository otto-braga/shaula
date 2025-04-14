<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Artwork;
use App\Models\Category;
use App\Models\Person;
use Illuminate\Database\Seeder;

class ArtworkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $artworks = Artwork::factory()->count(10)->create()->each(function ($artwork) {
            Person::factory(2)->create()->each(function ($person) use ($artwork) {
                $artwork->authors()->save($person, ['activity_id' => Activity::where('name', 'autoria')->first()->id]);
            });

            $category = Category::factory(4)->create([
                'class' => Artwork::class,
            ])->first();
            $category->update(['class' => Artwork::class]);
            $artwork->categories()->save($category);
        });
    }
}
