<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ProductionUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (!app()->environment('production')) {
            $this->command->info('Skipping ProductionUserSeeder because environment is not production.');
            return;
        }

        // 1. Create roles if they don't exist
        foreach (config('authorization.roles') as $role_name => $role_data) {
            Role::firstOrCreate(
                ['name' => $role_name],
                [
                    'label' => $role_data['label'],
                    'description' => $role_data['description'],
                ]
            );
        }

        // 2. Define passwords
        $passwordDev = 'Shaula@DEV#00';
        $passwordCoordination = 'Shaula@UFRN#COORD';
        $passwordEditor = 'Shaula@EDIT#DEART';

        // 3. Create users if they don't exist and attach roles

        // --- dev ---
        $devUser = User::firstOrCreate(
            ['email' => 'dev'],
            [
                'name' => 'dev',
                'password' => Hash::make($passwordDev),
            ]
        );
        $devUser->role()->associate(Role::where('name', 'dev')->firstOrFail())->save();

        // --- admin ---
        $admin1 = User::firstOrCreate(
            ['email' => 'coordenacao-1'],
            [
                'name' => 'Coordenação 1',
                'password' => Hash::make($passwordCoordination),
            ]
        );
        $admin1->role()->associate(Role::where('name', 'admin')->firstOrFail())->save();

        $admin2 = User::firstOrCreate(
            ['email' => 'coordenacao-2'],
            [
                'name' => 'Coordenação 2',
                'password' => Hash::make($passwordCoordination),
            ]
        );
        $admin2->role()->associate(Role::where('name', 'admin')->firstOrFail())->save();

        // --- editor ---
        $editor1 = User::firstOrCreate(
            ['email' => 'edicao-1'],
            [
                'name' => 'Edição 1',
                'password' => Hash::make($passwordEditor),
            ]
        );
        $editor1->role()->associate(Role::where('name', 'editor')->firstOrFail())->save();

        $editor2 = User::firstOrCreate(
            ['email' => 'edicao-2'],
            [
                'name' => 'Edição 2',
                'password' => Hash::make($passwordEditor),
            ]
        );
        $editor2->role()->associate(Role::where('name', 'editor')->firstOrFail())->save();
        
        $this->command->info('Production roles and users have been created/verified successfully!');
    }
}
