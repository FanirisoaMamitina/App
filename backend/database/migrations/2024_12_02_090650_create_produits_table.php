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
        Schema::create('produits', function (Blueprint $table) {
            $table->string('id')->primary(); // ID personnalisé
            $table->string('image', 225)->nullable();
            $table->foreignId('categorie_id')->constrained('categories')->onDelete('cascade');
            $table->string('nom_produit');
            $table->string('marque_produit');
            $table->text('description_produit')->nullable();
            $table->decimal('prix_original', 10, 2);
            $table->integer('stock')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produits');
    }
};
