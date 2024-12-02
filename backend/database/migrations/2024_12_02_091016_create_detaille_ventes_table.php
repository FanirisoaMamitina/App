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
        Schema::create('detaille_ventes', function (Blueprint $table) {
            $table->id();
            $table->string('vente_id'); // Doit correspondre au type 'id' de la table ventes
            $table->string('produit_id'); // Doit correspondre au type 'id' de la table produits
            $table->integer('quantite');
            $table->decimal('prix_unitaire', 10, 2);
            $table->timestamps();
        
            // Définir les clés étrangères
            $table->foreign('vente_id')->references('id')->on('ventes')->onDelete('cascade');
            $table->foreign('produit_id')->references('id')->on('produits')->onDelete('cascade');
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detaille_ventes');
    }
};
