<?php

namespace Database\Factories;

use App\Models\Activity;
use App\Models\Category;
use App\Models\HistoryArticle;
use App\Models\Person;
use App\Models\Review;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Review>
 */
class HistoryArticleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'slug' => $this->faker->slug,
            'title' => $this->faker->sentence,
            'date' => $this->faker->date,
            'content' => json_encode($this->faker->text),
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function ($review) {
            $authors = Person::inRandomOrder()->take(rand(1, 3))->get();
            foreach ($authors as $author) {
                $review->authors()->save($author, ['activity_id' => Activity::where('name', 'autoria')->first()->id]);
            }

            $categories = Category::where('class', HistoryArticle::class)->inRandomOrder()->take(rand(0, 5))->get();
            foreach ($categories as $category) {
                $review->categories()->attach($category);
            }
        });
    }
}
