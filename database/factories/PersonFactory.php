<?php

namespace Database\Factories;

use App\Models\City;
use App\Models\File;
use App\Models\Gender;
use App\Models\Period;
use App\Models\Person;
use App\Models\Source;
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
            'content' => json_encode($this->faker->text(4000)),
            'chronology' => json_encode($this->faker->text(2000)),
            'links' => "wikipedia",
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

            File::factory(rand(0, 4))->create([
                'mime_type' => 'image/png',
            ])->each(function ($file) use ($person) {
                $file->update([
                    'fileable_id' => $person->id,
                    'fileable_type' => Person::class,
                ]);
            });

            if ($person->images()->count() > 0) {
                $person->images()->first()->update(['is_primary' => true]);
            }

            $sources = Source::inRandomOrder()->take(rand(0, 4))->get();
            foreach ($sources as $source) {
                $person->sources()->attach($source);
            }

            MentionFactory::generateMentions($person);
        });
    }
}
