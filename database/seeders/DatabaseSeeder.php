<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        foreach (config('authorization.roles') as $role_name => $role_data) {
            Role::create([
                'name' => $role_name,
                'label' => $role_data['label'],
                'description' => $role_data['description'],
            ]);
        }

        $password = 'mudar@shaula';

        // dev

        $user = User::create([
            'name' => 'dev',
            'email' => 'dev',
            'password' => Hash::make($password),
        ]);
        $user->role()->associate(
            Role::where('name', 'dev')->firstOrFail()
        )->save();

        // admin

        $user = User::create([
            'name' => 'Coordenação 1',
            'email' => 'coordenacao-1',
            'password' => Hash::make($password),
        ]);
        $user->role()->associate(
            Role::where('name', 'admin')->firstOrFail()
        )->save();

        $user = User::create([
            'name' => 'Coordenação 2',
            'email' => 'coordenacao-2',
            'password' => Hash::make($password),
        ]);
        $user->role()->associate(
            Role::where('name', 'admin')->firstOrFail()
        )->save();

        // editor

        $user = User::create([
            'name' => 'Edição 1',
            'email' => 'edicao-1',
            'password' => Hash::make($password),
        ]);
        $user->role()->associate(
            Role::where('name', 'editor')->firstOrFail()
        )->save();

        $user = User::create([
            'name' => 'Edição 2',
            'email' => 'edicao-2',
            'password' => Hash::make($password),
        ]);
        $user->role()->associate(
            Role::where('name', 'editor')->firstOrFail()
        )->save();
    }
}
