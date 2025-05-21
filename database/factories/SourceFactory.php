<?php

namespace Database\Factories;

use App\Models\File;
use App\Models\Source;
use App\Models\SourceCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

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
            'title' => $this->faker->unique()->sentence,
            'content' => json_encode($this->faker->text),
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function ($source) {
            File::factory(1)->create([
                'mime_type' => 'application/pdf',
            ])->each(function ($file) use ($source) {
                $file->update([
                    'fileable_id' => $source->id,
                    'fileable_type' => Source::class,
                ]);
            });

            $source->file->update([
                'is_primary' => true,
            ]);

            $source->sourceCategories()->attach(
                SourceCategory::inRandomOrder()->take(2)->pluck('id')->toArray()
            );
        });
    }
}
