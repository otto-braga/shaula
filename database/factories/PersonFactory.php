<?php

namespace Database\Factories;

use App\Models\City;
use App\Models\Gender;
use App\Models\Period;
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
            'date_of_death' => rand(0, 1) ? $this->faker->date() : null,
            'content' => json_encode($this->faker->text),
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function ($person) {
            $person->cities()->attach(City::inRandomOrder()->first());
            $person->genders()->attach(Gender::inRandomOrder()->first());

            $periods = Period::inRandomOrder()->take(rand(0, 5))->get();
            foreach ($periods as $period) {
                $person->periods()->attach($period);
            }
        });
    }
}
