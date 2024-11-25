<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('ventes', function (Blueprint $table) {
            $table->datetime('DateReception')->nullable()->after('date'); // Ajout après 'date'
            $table->decimal('MontantRestant', 10, 2)->default(0)->after('montant_total');
            $table->decimal('TotalMontantPaye', 10, 2)->default(0)->after('MontantRestant');
            $table->enum('Status', ['direct', 'commande', 'soldée'])->default('direct')->after('TotalMontantPaye');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ventes', function (Blueprint $table) {
            $table->dropColumn(['DateReception', 'MontantRestant', 'TotalMontantPaye', 'Status']);
        });
    }
};
