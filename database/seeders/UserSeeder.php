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
        // dev

        $user = User::factory()->create([
            'name' => 'dev',
            'email' => 'dev',
        ]);
        $user->role()->associate(
            Role::where('name', 'dev')->firstOrFail()
        )->save();

        // admin

        $user = User::factory()->create([
            'name' => 'Coordenação 1',
            'email' => 'coordenacao-1',
        ]);
        $user->role()->associate(
            Role::where('name', 'admin')->firstOrFail()
        )->save();

        $user = User::factory()->create([
            'name' => 'Coordenação 2',
            'email' => 'coordenacao-2',
        ]);
        $user->role()->associate(
            Role::where('name', 'admin')->firstOrFail()
        )->save();

        // editor

        $user = User::factory()->create([
            'name' => 'Edição 1',
            'email' => 'edicao-1',
        ]);
        $user->role()->associate(
            Role::where('name', 'editor')->firstOrFail()
        )->save();
        $user = User::factory()->create([
            'name' => 'Edição 2',
            'email' => 'edicao-2',
        ]);
        $user->role()->associate(
            Role::where('name', 'editor')->firstOrFail()
        )->save();
    }
}
