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
        Schema::create('ventes', function (Blueprint $table) {
            $table->string('id')->primary(); // ID personnalisé
            $table->string('client_id'); // Doit correspondre au type de la clé primaire de la table clients
            $table->timestamp('date');
            $table->date('DateReception')->nullable();
            $table->decimal('montant_total', 10, 2);
            $table->decimal('MontantRestant', 10, 2)->default(0);
            $table->decimal('TotalMontantPaye', 10, 2)->default(0);
            $table->enum('Status', ['direct', 'commande', 'soldée']);
            $table->timestamps();
        
            // Définir la clé étrangère
            $table->foreign('client_id')->references('id')->on('clients')->onDelete('cascade');
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ventes');
    }
};
