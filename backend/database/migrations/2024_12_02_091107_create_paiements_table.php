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
        Schema::create('paiements', function (Blueprint $table) {
            $table->string('id')->primary(); // ID personnalisé
            $table->string('idVente'); // Correspond à l'ID personnalisé de la table ventes
            $table->string('Ref')->nullable(); // Référence unique ou code de suivi
            $table->decimal('MontantPaye', 10, 2);
            $table->timestamp('DatePaiement');
            $table->string('ModePaiement', 225); // Méthode de paiement (Ex: Cash, Carte, etc.)
            $table->timestamps();
        
            // Définir la clé étrangère
            $table->foreign('idVente')->references('id')->on('ventes')->onDelete('cascade');
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paiements');
    }
};
