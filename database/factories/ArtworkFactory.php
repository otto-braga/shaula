<?php

namespace Database\Factories;

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
            // 'content' => $this->faker->text(1000),
            'content' => json_encode($this->faker->text),
            'dimensions' => $this->faker->word,
            'materials' => $this->faker->word,
        ];
    }
}
