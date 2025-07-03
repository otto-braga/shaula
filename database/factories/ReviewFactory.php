<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\File;
use App\Models\Person;
use App\Models\Review;
use App\Models\Source;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Review>
 */
class ReviewFactory extends Factory
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
            'content' => json_encode($this->faker->text(4000)),
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

            File::factory(rand(0, 4))->create([
                'mime_type' => 'image/png',
            ])->each(function ($file) use ($review) {
                $file->update([
                    'fileable_id' => $review->id,
                    'fileable_type' => Review::class,
                ]);
            });

            if ($review->images()->count() > 0) {
                $review->images()->first()->update(['is_primary' => true]);
            }

            $sources = Source::inRandomOrder()->take(rand(0, 4))->get();
            foreach ($sources as $source) {
                $review->sources()->attach($source);
            }

            MentionFactory::generateMentions($review);
        });
    }
}
