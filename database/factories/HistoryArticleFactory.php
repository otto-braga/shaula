<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Period;
use App\Models\Person;
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
                $review->authors()->attach($author, ['is_author' => true]);
            }

            $categories = Category::inRandomOrder()->take(rand(0, 5))->get();
            foreach ($categories as $category) {
                $review->categories()->attach($category);
            }

            $periods = Period::inRandomOrder()->take(rand(0, 5))->get();
            foreach ($periods as $period) {
                $review->periods()->attach($period);
            }
        });
    }
}
