<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = ['Admin', 'User', 'Partner'];

        foreach ($roles as $role) {
            Role::firstOrCreate(['type' => $role]);
        }
    }
}
