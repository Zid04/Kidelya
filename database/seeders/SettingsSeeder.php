<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'app_name',        'value' => 'Kidelya'],
            ['key' => 'contact_email',   'value' => 'contact@kidelya.com'],
            ['key' => 'stripe_enabled',  'value' => 'true'],
            ['key' => 'theme',           'value' => 'light'],
        ];

        foreach ($settings as $setting) {
            DB::table('settings')->updateOrInsert(
                ['key' => $setting['key']],
                ['value' => $setting['value'], 'updated_at' => now(), 'created_at' => now()]
            );
        }
    }
}
