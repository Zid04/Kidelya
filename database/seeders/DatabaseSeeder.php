<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

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
            SubscriptionSeeder::class,   
            CreditTransactionSeeder::class, 
            SettingsSeeder::class,    
            SubscriptionPlanSeeder::class,   
        ]);
    }
}