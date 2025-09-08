<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

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

        $this->call(UserSeeder::class);
    }
}
