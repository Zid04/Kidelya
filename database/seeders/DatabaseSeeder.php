<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

/**
 * Seeder principal.
 *
 * Orchestre tous les seeders dans le bon ordre.
 * L'ordre est crucial — respecter les dépendances entre tables.
 */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,        
            UserSeeder::class,        
            ThemeSeeder::class,       
            CompetenceSeeder::class,  
            ActivitySeeder::class,    
            PackSeeder::class,        
        ]);
    }
}