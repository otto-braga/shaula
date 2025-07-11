<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        foreach (config('authorization.roles') as $role_name => $role_data) {
            Role::create([
                'name' => $role_name,
                'description' => $role_data['description'],
            ]);
        }
    }
}
