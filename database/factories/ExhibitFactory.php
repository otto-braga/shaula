<?php

namespace Database\Factories;

use App\Models\Activity;
use App\Models\Artwork;
use App\Models\Exhibit;
use App\Models\Award;
use App\Models\Category;
use App\Models\File;
use App\Models\Period;
use App\Models\Person;
use App\Models\Source;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Exhibit>
 */
class ExhibitFactory extends Factory
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
            'date' => $this->faker->date(),
            'content' => json_encode($this->faker->text(4000)),
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function ($exhibit) {
            $authors = Person::inRandomOrder()->take(rand(1, 3))->get();
            foreach ($authors as $author) {
                $exhibit->authors()->attach($author, ['is_author' => true]);
            }

            $activities = Activity::inRandomOrder()->take(rand(0, 3))->get();
            foreach ($activities as $activity) {
                $people = Person::inRandomOrder()->take(rand(1, 3))->get();
                foreach ($people as $person) {
                    $exhibit->people()->attach($person, ['activity_id' => $activity->id]);
                }
            }

            $categories = Category::inRandomOrder()->take(rand(0, 5))->get();
            foreach ($categories as $category) {
                $exhibit->categories()->attach($category);
            }

            $awards = Award::inRandomOrder()->take(rand(0, 5))->get();
            foreach ($awards as $award) {
                $exhibit->awards()->attach($award);
            }

            $periods = Period::inRandomOrder()->take(rand(0, 5))->get();
            foreach ($periods as $period) {
                $exhibit->periods()->attach($period);
            }

            File::factory(rand(0, 4))->create([
                'mime_type' => 'image/png',
            ])->each(function ($file) use ($exhibit) {
                $file->update([
                    'fileable_id' => $exhibit->id,
                    'fileable_type' => Exhibit::class,
                ]);
            });

            if ($exhibit->images()->count() > 0) {
                $exhibit->images()->first()->update(['is_primary' => true]);
            }

            $sources = Source::inRandomOrder()->take(rand(0, 4))->get();
            foreach ($sources as $source) {
                $exhibit->sources()->attach($source);
            }

            $artworks = Artwork::inRandomOrder()->take(rand(0, 5))->get();
            foreach ($artworks as $artwork) {
                $exhibit->artworks()->attach($artwork);
            }
        });
    }
}
