<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Work>
 */
class WorkFactory extends Factory
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
            'content' => $this->faker->text(1000),
            'date' => $this->faker->date,
            'date_end' => $this->faker->date,
            'description' => $this->faker->paragraph,
            'content' => json_encode($this->faker->text),
            'slug' => $this->faker->slug,
        ];
    }
}
