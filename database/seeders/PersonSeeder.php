<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Gender;
use App\Models\Person;
use Illuminate\Database\Seeder;

class PersonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Person::factory()->create(['name' => 'Same Name Test Person']);
        Person::factory()->create(['name' => 'Same Name Test Person']);
        Person::factory()->create(['name' => 'Same Name Test Person']);
        Person::factory()->create(['name' => 'Same Name Test Person']);
        Person::factory(20)->create();
    }
}
