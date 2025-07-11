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
        $user->role()->associate(
            Role::where('name', 'dev')->firstOrFail()
        )->save();

        $user = User::factory()->create([
            'name' => 'Usuário Coordenador',
            'email' => 'coordinator@test.com',
        ]);
        $user->role()->associate(
            Role::where('name', 'Coordenador')->firstOrFail()
        )->save();

        $user = User::factory()->create([
            'name' => 'Usuário Editor',
            'email' => 'editor@test.com',
        ]);
        $user->role()->associate(
            Role::where('name', 'Editor')->firstOrFail()
        )->save();
    }
}
