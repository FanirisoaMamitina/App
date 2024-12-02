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
        Schema::create('factures', function (Blueprint $table) {
            $table->string('id')->primary(); // ID personnalisé
            $table->string('idPaiement'); // Correspond à l'ID personnalisé de la table paiements
            $table->timestamp('dateFacture');
            $table->string('description', 225)->nullable();
            $table->timestamps();
        
            // Définir la clé étrangère
            $table->foreign('idPaiement')->references('id')->on('paiements')->onDelete('cascade');
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('factures');
    }
};
