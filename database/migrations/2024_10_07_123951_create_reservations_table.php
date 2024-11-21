<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Clé étrangère vers users
            $table->foreignId('vehicule_id')->constrained()->onDelete('cascade'); // Clé étrangère vers vehicles
            $table->string('motif')->nullable(); // Champ pour le motif de la réservation
            $table->date('date_depart'); // Date de départ
            $table->date('date_retour'); // Date de retour
            $table->enum('status', ['en attente', 'confirmée', 'annulée'])->default('en attente'); // Statut en français
            $table->enum('type_voyage', ['circuit', 'boucle', 'transfert']); // Ajout du type de voyage
            $table->string('destination')->nullable(); // Add the destination column
            $table->json('pieces_jointes')->nullable(); // Champ pour les pièces jointes au format JSON
            $table->timestamps(); // Ajout des colonnes created_at et updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
