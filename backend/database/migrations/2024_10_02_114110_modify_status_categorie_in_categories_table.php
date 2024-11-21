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
        Schema::table('categories', function (Blueprint $table) {
            // Supprimer la colonne existante
            $table->dropColumn('status_categorie');
        });

        Schema::table('categories', function (Blueprint $table) {
            // Ajouter la colonne avec le type boolean et une valeur par défaut
            $table->boolean('status_categorie')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            // Supprimer la colonne
            $table->dropColumn('status_categorie');
        });

        Schema::table('categories', function (Blueprint $table) {
            // Recréer la colonne avec le type tinyInteger en cas de rollback
            $table->tinyInteger('status_categorie');
        });
    }
};
