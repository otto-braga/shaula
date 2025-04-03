<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Artwork;
use App\Models\Category;
use App\Models\Person;
use App\Models\Work;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ArtworkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $artworks = Artwork::factory()->count(10)->create()->each(function ($artwork) {
            Work::factory()->create(['workable_type' => Artwork::class, 'workable_id' => $artwork->id]);

            $category = Category::factory()->create();
            $category->update(['class' => Artwork::class]);
            $artwork->work->categories()->save($category);

            Person::factory(2)->create()->each(function ($person) use ($artwork) {
                $artwork->work->people()->save($person, ['activity_id' => Activity::where('name', 'autoria')->first()->id]);
            });
        });
    }
}
