<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create default roles
        \App\Models\Role::create([
            'name' => 'dev'
        ]);

        \App\Models\Role::create([
            'name' => 'Coordenador',
        ]);

        \App\Models\Role::create([
            'name' => 'Membro',
        ]);
    }
}
