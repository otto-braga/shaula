<?php

namespace Database\Factories;

use App\Models\Activity;
use App\Models\Artwork;
use App\Models\Award;
use App\Models\Category;
use App\Models\Language;
use App\Models\Person;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Artwork>
 */
class ArtworkFactory extends Factory
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
            'dimensions' => $this->faker->word,
            'materials' => $this->faker->word,
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function ($artwork) {
            $authors = Person::inRandomOrder()->take(rand(1, 3))->get();
            foreach ($authors as $author) {
                $artwork->authors()->attach($author);
            }

            $activities = Activity::inRandomOrder()->take(rand(0, 3))->get();
            foreach ($activities as $activity) {
                $people = Person::inRandomOrder()->take(rand(1, 3))->get();
                foreach ($people as $person) {
                    $artwork->people()->save($person, ['activity_id' => $activity->id]);
                }
            }

            $categories = Category::where('class', Artwork::class)->inRandomOrder()->take(rand(0, 5))->get();
            foreach ($categories as $category) {
                $artwork->categories()->attach($category);
            }

            $languages = Language::inRandomOrder()->take(rand(0, 5))->get();
            foreach ($languages as $language) {
                $artwork->languages()->attach($language);
            }

            $awards = Award::inRandomOrder()->take(rand(0, 5))->get();
            foreach ($awards as $award) {
                $artwork->awards()->attach($award);
            }
        });
    }
}
