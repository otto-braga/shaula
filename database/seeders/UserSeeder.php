<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'dev',
            'email' => 'dev@test.com',
        ]);
        $user->roles()->attach(
            Role::where('name', 'dev')->firstOrFail(),
            ['is_default' => true]
        );

        $user = User::factory()->create([
            'name' => 'Usuário Coordenador',
            'email' => 'coordinator@test.com',
        ]);
        $user->roles()->attach(
            Role::where('name', 'Coordenador')->firstOrFail(),
            ['is_default' => true]
        );

        $user = User::factory()->create([
            'name' => 'Usuário Editor',
            'email' => 'editor@test.com',
        ]);
        $user->roles()->attach(
            Role::where('name', 'Editor')->firstOrFail(),
            ['is_default' => true]
        );
    }
}
