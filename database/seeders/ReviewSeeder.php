<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Category;
use App\Models\Person;
use App\Models\Review;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Review::factory(10)->create()->each(function (Review $review): void {
            Person::factory(3)->create()->each(function (Person $person) use ($review): void {
                $review->authors()->save($person, ['activity_id' => Activity::where('name', 'autoria')->first()->id]);
            });

            $category = Category::factory(4)->create([
                'class' => Review::class,
            ])->first();
            $category->update(['class' => Review::class]);
            $review->categories()->save($category);
        });
    }
}
