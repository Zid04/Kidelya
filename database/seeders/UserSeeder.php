<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Seeder pour les utilisateurs.
 *
 * Crée un Admin, un User et un Partner de test.
 * Dépend de RoleSeeder.
 */
class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Récupération des rôles créés par RoleSeeder
        $adminRole   = Role::where('Type', 'Admin')->first();
        $userRole    = Role::where('Type', 'User')->first();
        $partnerRole = Role::where('Type', 'Partner')->first();

        // Compte Admin
        User::firstOrCreate(
            ['Email' => 'admin@kidelya.com'],
            [
                'FirstName' => 'first',
                'LastName'  => 'Admin',
                'Password'  => Hash::make('password'),
                'is_active' => true,
                'IdRole'    => $adminRole->IdRole,
            ]
        );

        // Compte User standard
        User::firstOrCreate(
            ['Email' => 'user@kidelya.com'],
            [
                'FirstName' => 'jonh',
                'LastName'  => 'smith',
                'Password'  => Hash::make('password'),
                'is_active' => true,
                'IdRole'    => $userRole->IdRole,
            ]
        );

        // Compte Partner
        User::firstOrCreate(
            ['Email' => 'partner@kidelya.com'],
            [
                'FirstName' => 'Jane',
                'LastName'  => 'wilson',
                'Password'  => Hash::make('password'),
                'is_active' => true,
                'IdRole'    => $partnerRole->IdRole,
            ]
        );
    }
}