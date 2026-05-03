<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

/**
 * Seeder pour les rôles.
 *
 * Crée les 3 rôles de base de l'application.
 * Doit toujours être exécuté en premier car
 * la table users dépend de IdRole.
 */
class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = ['Admin', 'User', 'Partner'];

        foreach ($roles as $role) {
            Role::firstOrCreate(['Type' => $role]);
        }
    }
}