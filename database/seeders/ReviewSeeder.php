<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Category;
use App\Models\Person;
use App\Models\Review;
use App\Models\Work;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Review::factory(10)->create()->each(function (Review $review): void {
            Work::factory()->create(['workable_type' => Review::class, 'workable_id' => $review->id]);

            $category = Category::factory()->create();
            $category->update(['class' => Review::class]);
            $review->work->categories()->save($category);

            Person::factory(3)->create()->each(function (Person $person) use ($review): void {
                $review->work->people()->save($person, ['activity_id' => Activity::where('name', 'autoria')->first()->id]);
            });
        });
    }
}
