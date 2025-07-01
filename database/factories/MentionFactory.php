<?php

namespace Database\Factories;

use App\Models\Artwork;
use App\Models\HistoryArticle;
use App\Models\Person;
use App\Models\Review;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Mention>
 */
class MentionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            //
        ];
    }

    static public function generateMentions(Model $instance)
    {
        $mentions = [];

        $models = Artwork::inRandomOrder()->take(rand(0, 4))->get();
        foreach ($models as $model) {
            $mentions[] = [
                'type' => 'artworks',
                'key' => $model->uuid,
                'name' => $model->title,
                'route' => route('public.artworks.show', $model->slug),
            ];
        }
        $models = Person::inRandomOrder()->take(rand(0, 4))->get();
        foreach ($models as $model) {
            $mentions[] = [
                'type' => 'people',
                'key' => $model->uuid,
                'name' => $model->name,
                'route' => route('public.people.show', $model->slug),
            ];
        }
        $models = Review::inRandomOrder()->take(rand(0, 4))->get();
        foreach ($models as $model) {
            $mentions[] = [
                'type' => 'reviews',
                'key' => $model->uuid,
                'name' => $model->title,
                'route' => route('public.reviews.show', $model->slug),
            ];
        }
        $models = HistoryArticle::inRandomOrder()->take(rand(0, 4))->get();
        foreach ($models as $model) {
            $mentions[] = [
                'type' => 'history_articles',
                'key' => $model->uuid,
                'name' => $model->title,
                'route' => route('public.history_articles.show', $model->slug),
            ];
        }

        $instance->content = implode(
            ', ',
            array_map(
                function ($mention) {
                    return '<span class="shaula-mention"><a data-type="' . $mention['type'] . '" data-key="' . $mention['key'] . '" href="' . $mention['route'] . '">' . $mention['name'] . '</a></span>';
                },
                $mentions
            )
        ) . '. ' . $instance->content;

        $instance->save();
    }
}
