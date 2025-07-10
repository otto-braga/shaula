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
            'name' => 'dev',
            'description' => 'Desenvolvedor. Acesso total ao sistema.',
        ]);

        \App\Models\Role::create([
            'name' => 'Coordenador',
            'description' => 'Coordenador. Acesso total ao sistema, exceto configurações administrativas.',
        ]);

        \App\Models\Role::create([
            'name' => 'Membro',
            'description' => 'Membro. Acesso limitado a funcionalidades básicas do sistema.',
        ]);
    }
}
