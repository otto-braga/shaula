<?php

namespace Database\Factories;

use App\Models\Artwork;
use App\Models\File;
use App\Models\Person;
use App\Models\Source;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Source>
 */
class SourceFactory extends Factory
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
            'url' => $this->faker->url,
            'content' => json_encode($this->faker->text),
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function ($source) {
            $authors = \App\Models\Person::inRandomOrder()->take(rand(1, 3))->get();
            foreach ($authors as $author) {
                $source->authors()->attach($author, ['is_author' => true]);
            }

            $categories = \App\Models\Category::inRandomOrder()->take(rand(0, 5))->get();
            foreach ($categories as $category) {
                $source->categories()->attach($category);
            }

            $periods = \App\Models\Period::inRandomOrder()->take(rand(0, 5))->get();
            foreach ($periods as $period) {
                $source->periods()->attach($period);
            }

            $mentioned = \App\Models\Person::inRandomOrder()->take(rand(0, 5))->get();
            foreach ($mentioned as $person) {
                $mention = \App\Models\Mention::create([
                    'mentioner_id' => $source->id,
                    'mentioner_type' => Source::class,
                    'mentioned_id' => $person->id,
                    'mentioned_type' => Person::class,
                ]);
                $mention->save();
            }
            $source->save();

            $mentioned = \App\Models\Artwork::inRandomOrder()->take(rand(0, 5))->get();
            foreach ($mentioned as $artwork) {
                $mention = \App\Models\Mention::create([
                    'mentioner_id' => $source->id,
                    'mentioner_type' => Source::class,
                    'mentioned_id' => $artwork->id,
                    'mentioned_type' => Artwork::class,
                ]);
                $mention->save();
            }
            $source->save();

            File::factory(rand(1, 4))->create([
                'mime_type' => 'application/pdf',
            ])->each(function ($file) use ($source) {
                $file->update([
                    'fileable_id' => $source->id,
                    'fileable_type' => Source::class,
                ]);
            });

            File::factory(rand(1, 4))->create([
                'mime_type' => 'image/png',
            ])->each(function ($file) use ($source) {
                $file->update([
                    'fileable_id' => $source->id,
                    'fileable_type' => Source::class,
                ]);
            });

            $source->images()->first()->update(['is_primary' => true]);
        });
    }
}
