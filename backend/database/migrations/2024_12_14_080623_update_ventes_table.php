<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateVentesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('ventes', function (Blueprint $table) {
            // Modifier la colonne "Status"
            $table->dropColumn('Status'); // Supprimez l'ancienne colonne

            // Ajouter les nouvelles colonnes
            $table->enum('type_vente', ['direct', 'commande'])->after('TotalMontantPaye')->default('direct');
            $table->enum('statut_paiement', ['non payé', 'partiellement payé', 'payé'])->after('type_vente')->default('non payé');
            $table->enum('statut_reception', ['en attente', 'reçu'])->after('statut_paiement')->default('en attente');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('ventes', function (Blueprint $table) {
            // Revenir à la version précédente
            $table->dropColumn('type_vente');
            $table->dropColumn('statut_paiement');
            $table->dropColumn('statut_reception');
            $table->enum('Status', ['direct', 'commande', 'soldée'])->after('TotalMontantPaye');
        });
    }
}
