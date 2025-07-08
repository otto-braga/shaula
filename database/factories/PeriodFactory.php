<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PeriodFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('-100 years', 'now');
        $endDate = $this->faker->dateTimeBetween($startDate, 'now');

        return [
            'name' => $this->faker->unique()->word,
            'start_date' => $startDate,
            'end_date' => $endDate,
        ];
    }
}
