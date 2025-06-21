<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\File;
use App\Models\Period;
use App\Models\Person;
use App\Models\Source;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\HistoryArticle>
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
            'content' => json_encode($this->faker->text(4000)),
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function ($article) {
            $authors = Person::inRandomOrder()->take(rand(1, 3))->get();
            foreach ($authors as $author) {
                $article->authors()->attach($author);
            }

            $categories = Category::inRandomOrder()->take(rand(0, 5))->get();
            foreach ($categories as $category) {
                $article->categories()->attach($category);
            }

            $periods = Period::inRandomOrder()->take(rand(0, 5))->get();
            foreach ($periods as $period) {
                $article->periods()->attach($period);
            }

            File::factory(rand(0, 4))->create([
                'mime_type' => 'image/png',
            ])->each(function ($file) use ($article) {
                $file->update([
                    'fileable_id' => $article->id,
                    'fileable_type' => get_class($article),
                ]);
            });

            if ($article->images()->count() > 0) {
                $article->images()->first()->update(['is_primary' => true]);
            }

            $sources = Source::inRandomOrder()->take(rand(0, 4))->get();
            foreach ($sources as $source) {
                $article->sources()->attach($source);
            }

            MentionFactory::generateMentions($article);
        });
    }
}
