<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateTypeVenteInVentesTable extends Migration
{
    public function up()
    {
        Schema::table('ventes', function (Blueprint $table) {
            $table->enum('type_vente', ['direct', 'commande', 'annulé'])
                  ->default('direct')
                  ->change();
        });
    }

    public function down()
    {
        Schema::table('ventes', function (Blueprint $table) {
            $table->enum('type_vente', ['direct', 'commande'])
                  ->default('direct')
                  ->change();
        });
    }
}
