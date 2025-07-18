<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'dev',
        //     'email' => 'dev@test.com',
        // ]);

        // $this->call(TestSeeder::class);

        foreach (config('authorization.roles') as $role_name => $role_data) {
            Role::create([
                'name' => $role_name,
                'label' => $role_data['label'],
                'description' => $role_data['description'],
            ]);
        }

        $user = User::create([
            'name' => 'dev',
            'email' => 'dev@test.com',
            'password' => '123',
        ]);
        $user->role()->associate(
            Role::where('name', 'dev')->firstOrFail()
        )->save();

        $user = User::create([
            'name' => 'Usuário Coordenador',
            'email' => 'admin@test.com',
            'password' => '123',
        ]);
        $user->role()->associate(
            Role::where('name', 'admin')->firstOrFail()
        )->save();

        $user = User::create([
            'name' => 'Usuário Editor',
            'email' => 'editor@test.com',
            'password' => '123',
        ]);
        $user->role()->associate(
            Role::where('name', 'editor')->firstOrFail()
        )->save();
    }
}
