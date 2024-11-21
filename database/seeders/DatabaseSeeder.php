<?php

namespace Database\Seeders;

use App\Models\Categorie;
use App\Models\User;
use App\Models\Vehicule;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

         // Créer 20 catégories
         Categorie::factory(20)->create();

         // Créer 20 véhicules
         Vehicule::factory(50)->create();
    }
}
