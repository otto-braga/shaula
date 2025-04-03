<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Gender;
use App\Models\Person;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PersonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Person::factory(10)->create()->each(function ($person) {
            $person->cities()->attach(City::inRandomOrder()->first());
            $person->genders()->attach(Gender::inRandomOrder()->first());
        });
    }
}
