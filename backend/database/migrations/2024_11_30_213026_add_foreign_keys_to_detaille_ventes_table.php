<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToDetailleVentesTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('detaille_ventes', function (Blueprint $table) {
            $table->foreign('vente_id')
                ->references('id')
                ->on('ventes')
                ->onDelete('cascade');

            $table->foreign('produit_id')
                ->references('id')
                ->on('produits')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('detaille_ventes', function (Blueprint $table) {
            $table->dropForeign(['vente_id']);
            $table->dropForeign(['produit_id']);
        });
    }
}
