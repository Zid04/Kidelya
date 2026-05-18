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
        // ─────────────────────────────────────────────
        // 1. Récupération des rôles
        // ─────────────────────────────────────────────
        $adminRole   = Role::where('type', 'Admin')->first();
        $userRole    = Role::where('type', 'User')->first();
        $partnerRole = Role::where('type', 'Partner')->first();

        if (!$adminRole || !$userRole || !$partnerRole) {
            $this->command->warn("⚠️ UserSeeder skipped: missing roles.");
            return;
        }

        // ─────────────────────────────────────────────
        // 2. Admin principal
        // ─────────────────────────────────────────────
        User::firstOrCreate(
            ['email' => 'admin@kidelya.com'],
            [
                'firstname'      => 'First',
                'lastname'       => 'Admin',
                'password'       => Hash::make('password'),
                'is_active'      => true,
                'credit_balance' => 0,
                'idrole'         => $adminRole->idrole,
            ]
        );

        // ─────────────────────────────────────────────
        // 3. User 1
        // ─────────────────────────────────────────────
        User::firstOrCreate(
            ['email' => 'user@kidelya.com'],
            [
                'firstname'      => 'John',
                'lastname'       => 'Smith',
                'password'       => Hash::make('password'),
                'is_active'      => true,
                'credit_balance' => 50, // utile pour tester achats
                'idrole'         => $userRole->idrole,
            ]
        );

        // ─────────────────────────────────────────────
        // 4. User 2
        // ─────────────────────────────────────────────
        User::firstOrCreate(
            ['email' => 'user2@kidelya.com'],
            [
                'firstname'      => 'Alice',
                'lastname'       => 'Brown',
                'password'       => Hash::make('password'),
                'is_active'      => true,
                'credit_balance' => 30,
                'idrole'         => $userRole->idrole,
            ]
        );

        // ─────────────────────────────────────────────
        // 5. Partner
        // ─────────────────────────────────────────────
        User::firstOrCreate(
            ['email' => 'partner@kidelya.com'],
            [
                'firstname'      => 'Jane',
                'lastname'       => 'Wilson',
                'password'       => Hash::make('password'),
                'is_active'      => true,
                'credit_balance' => 0,
                'idrole'         => $partnerRole->idrole,
            ]
        );
    }
}
