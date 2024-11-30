<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyColumnsInDetailleVentesTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('detaille_ventes', function (Blueprint $table) {
            // Modifier les colonnes vente_id et produit_id en unsignedBigInteger
            $table->unsignedBigInteger('vente_id')->change();
            $table->unsignedBigInteger('produit_id')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('detaille_ventes', function (Blueprint $table) {
            // Revenir aux colonnes d'origine (integer)
            $table->integer('vente_id')->change();
            $table->integer('produit_id')->change();
        });
    }
}
