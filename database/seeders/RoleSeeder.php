<?php

namespace Database\Seeders;

use App\Models\Role;
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
            'name' => 'dev',
            'description' => 'Acesso total ao sistema.',
        ]);

        \App\Models\Role::create([
            'name' => 'Coordenador',
            'description' => 'Acesso total ao sistema, exceto configurações administrativas.',
        ]);

        \App\Models\Role::create([
            'name' => 'Editor',
            'description' => 'Acesso limitado a funcionalidades básicas do sistema.',
        ]);

        // foreach (config('permission.roles') as $name => $description) {
        //     Role::firstOrCreate([
        //         'name' => $name,
        //     ], [
        //         'description' => $description,
        //     ]);
        // }
    }
}
