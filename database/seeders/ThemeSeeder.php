<?php

namespace Database\Seeders;

use App\Models\Theme;
use Illuminate\Database\Seeder;

class ThemeSeeder extends Seeder
{
    public function run(): void
    {
        $themes = [
            'Nature',
            'Sport',
            'Art',
            'Musique',
            'Science',
            'Cuisine',
            'Voyage',
            'Technologie',
            'Lecture',
            'Cinéma',
            'Théâtre',
            'Danse',
        ];

        foreach ($themes as $theme) {
            Theme::firstOrCreate(['name' => $theme]);
        }
    }
}
