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
        Schema::create('historique_actions', function (Blueprint $table) {
            $table->id();
            $table->string('action');  // 'ajout', 'modification', ou 'suppression'
            $table->string('table');   // nom de la table affectée
            $table->unsignedBigInteger('element_id'); // ID de l'élément affecté
            $table->json('details')->nullable(); // détails de l'action
            $table->unsignedBigInteger('user_id')->nullable(); // optionnel : ID de l'utilisateur
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historique_actions');
    }
};
