<?php

namespace Database\Factories;

use App\Models\Activity;
use App\Models\Artwork;
use App\Models\Award;
use App\Models\Category;
use App\Models\File;
use App\Models\Language;
use App\Models\Period;
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
            'title' => $this->faker->sentence,
            'date' => $this->faker->date,
            'content' => json_encode($this->faker->text(4000)),
            'dimensions' => $this->faker->word,
            'materials' => $this->faker->word,
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function ($artwork) {
            $authors = Person::inRandomOrder()->take(rand(1, 3))->get();
            foreach ($authors as $author) {
                // $artwork->authors()->attach($author, ['is_author' => true]);
                $artwork->authors()->attach($author);
            }

            $activities = Activity::inRandomOrder()->take(rand(0, 3))->get();
            foreach ($activities as $activity) {
                $people = Person::inRandomOrder()->take(rand(1, 3))->get();
                foreach ($people as $person) {
                    $artwork->people()->attach($person, ['activity_id' => $activity->id]);
                }
            }

            $categories = Category::inRandomOrder()->take(rand(0, 5))->get();
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

            $periods = Period::inRandomOrder()->take(rand(0, 5))->get();
            foreach ($periods as $period) {
                $artwork->periods()->attach($period);
            }

            File::factory(rand(1, 4))->create([
                'mime_type' => 'image/png',
            ])->each(function ($file) use ($artwork) {
                $file->update([
                    'fileable_id' => $artwork->id,
                    'fileable_type' => Artwork::class,
                ]);
            });

            $artwork->images()->first()->update(['is_primary' => true]);
        });
    }
}
