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
        $content_examples = [
            '. The Art of Painting. Art Publishers, 2020.',
            '. Modern Sculpture. 2019. https://example.com/modern-sculpture',
            '. Contemporary Art. In: Art Today, edited by Mark Brown, Art House, 2021, pp. 50-60.',
            '. Digital Art Revolution. In: Digital Arts Conference, New York, 2022. https://example.com/digital-art-revolution',
            '. Abstract Expressionism. In: Journal of Modern Art, vol. 5, no. 2, 2023, pp. 100-110.',
            '. The Future of Art. Art Journal, 2024. https://example.com/future-of-art',
            '. Art and Technology. In: Tech and Art Symposium, San Francisco, 2023. https://example.com/art-and-technology',
            '. Art in the Digital Age. In: Digital Art Review, vol. 10, no. 3, 2022, pp. 200-210.',
            '. The Evolution of Art. Art History Journal, 2021. https://example.com/evolution-of-art',
            '. Art and Society. In: Social Impact of Art, edited by David Green, Art Press, 2020, pp. 30-40.',
            '. The Role of Art in Culture. In: Cultural Studies Journal, vol. 15, no. 4, 2023, pp. 150-160.',
            '. Art and Identity. In: Identity in Art, edited by Anna Lee, Art World, 2022, pp. 70-80.',
        ];

        return [
            'title' => $this->faker->unique()->sentence,
            'content' => $content_examples[array_rand($content_examples)],
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function ($source) {
            $author= $this->faker->unique()->name();

            $title = Str::betweenFirst($source->content, '.', '.');
            $title = $author . '. ' . $title;

            if (in_array($title, Source::all()->pluck('title')->toArray())) {
                $title = $title . ' (' . $source->id . ')';
            }

            $content = $author . $source->content;

            $source->update([
                'title' => $title,
                'content' => $content,
            ]);

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
