<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['type' => 'Admin'],
            ['type' => 'User'],
            ['type' => 'Partner'],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate($role);
        }
    }
}
