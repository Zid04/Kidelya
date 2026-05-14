<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Récupération des rôles créés par RoleSeeder
        $adminRole   = Role::where('type', 'Admin')->first();
        $userRole    = Role::where('type', 'User')->first();
        $partnerRole = Role::where('type', 'Partner')->first();

        // Compte Admin
        User::firstOrCreate(
            ['email' => 'admin@kidelya.com'],
            [
                'firstname' => 'first',
                'lastname'  => 'admin',
                'password'  => Hash::make('password'),
                'is_active' => true,
                'idrole'    => $adminRole->idrole,
            ]
        );

        // Compte User standard
        User::firstOrCreate(
            ['email' => 'user@kidelya.com'],
            [
                'firstname' => 'john',
                'lastname'  => 'smith',
                'password'  => Hash::make('password'),
                'is_active' => true,
                'idrole'    => $userRole->idrole,
            ]
        );

        // Compte Partner
        User::firstOrCreate(
            ['email' => 'partner@kidelya.com'],
            [
                'firstname' => 'jane',
                'lastname'  => 'wilson',
                'password'  => Hash::make('password'),
                'is_active' => true,
                'idrole'    => $partnerRole->idrole,
            ]
        );
    }
}
