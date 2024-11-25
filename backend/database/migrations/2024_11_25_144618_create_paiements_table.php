<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaiementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('paiements', function (Blueprint $table) {
            $table->string('id')->primary(); // Identifiant personnalisé au format "PAY-123"
            $table->bigInteger('idVente')->unsigned(); // Référence à la table 'ventes'
            $table->string('Ref')->unique(); // Référence du paiement
            $table->decimal('MontantPaye', 10, 2); // Montant payé
            $table->datetime('DatePaiement'); // Date du paiement
            $table->string('ModePaiement'); // Mode de paiement (ex : 'espèces', 'CB')
            $table->timestamps(); // Champs created_at et updated_at

            // Contrainte de clé étrangère
            $table->foreign('idVente')->references('id')->on('ventes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('paiements');
    }
}
