<?php

namespace Tests\Feature;

use App\Models\Vehicule;
use App\Models\Categorie;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VehiculeTest extends TestCase
{
    use RefreshDatabase;

    public function test_vehicules_can_be_created()
    {
        // Créer 20 catégories et 20 véhicules
        Categorie::factory(20)->create();
        Vehicule::factory(20)->create();

        $this->assertCount(20, Vehicule::all());
    }

    public function test_categories_can_be_created()
    {
        // Créer 20 catégories
        Categorie::factory(20)->create();

        $this->assertCount(20, Categorie::all());
    }
}
