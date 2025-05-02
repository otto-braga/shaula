<?php

namespace Database\Seeders;

use App\Models\Artwork;
use App\Models\File;
use Illuminate\Database\Seeder;

class ArtworkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Artwork::factory(20)->create();
    }
}
