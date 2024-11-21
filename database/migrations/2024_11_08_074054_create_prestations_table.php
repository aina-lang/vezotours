<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('prestations', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 100);
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->foreignId('service_type_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('prestations');
    }
};
