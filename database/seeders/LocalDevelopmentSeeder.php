<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class LocalDevelopmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        // Ensure this seeder only runs in the local environment
        if (!app()->environment('local')) {
            $this->command->info('Skipping LocalDevelopmentSeeder because environment is not local.');
            return;
        }

        // 1. Create essential roles if they don't exist
        $roles = config('authorization.roles', []);
        foreach ($roles as $role_name => $role_data) {
            Role::firstOrCreate(
                ['name' => $role_name],
                [
                    'label' => $role_data['label'] ?? ucfirst($role_name),
                    'description' => $role_data['description'] ?? '',
                ]
            );
        }

        // 2. Create the dev user and associate the 'dev' role
        $devRole = Role::where('name', 'dev')->first();
        if ($devRole) {
            $devUser = User::firstOrCreate(
                ['email' => 'dev@dev.com'], // dev email
                [
                    'name' => 'Dev User',
                    'password' => Hash::make('password'),
                ]
            );
            
            if ($devUser->role_id === null) {
                $devUser->role()->associate($devRole)->save();
            }

            $this->command->info('Dev user created or found. (Email: dev@dev.com / Password: password)');
        }

        // 3. Populate fake data
        // The individual seeders use factories (e.g., PersonFactory, ArtworkFactory) 
        // that are already configured to establish relations between models 
        // (e.g., an Artwork automatically attaches a Person as an author).
        $this->command->info('Populating fake data with relationships...');
        
        $this->call([
            GenderSeeder::class,
            CitySeeder::class,
            ActivitySeeder::class,
            CategorySeeder::class,
            PeriodSeeder::class,
            LanguageSeeder::class,
            AwardSeeder::class,
            // PersonSeeder creates the artists/authors
            PersonSeeder::class,
            SourceSeeder::class,
            // ArtworkSeeder and ReviewSeeder will automatically associate themselves
            // with random Persons as authors/artists via their factory configurations.
            ArtworkSeeder::class,
            ReviewSeeder::class,
            HistoryArticleSeeder::class,
            ExhibitSeeder::class,
        ]);
        
        $this->command->info('Local development data has been seeded successfully.');
    }
}
