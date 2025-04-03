<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Person>
 */
class PersonFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name,
            'date_of_birth' => $this->faker->date(),
            'date_of_death' => $this->faker->date(),
            'bio' => $this->faker->text,
            'chrono' => $this->faker->text,
        ];
    }
}
