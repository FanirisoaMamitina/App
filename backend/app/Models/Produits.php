<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produits extends Model
{
    use HasFactory;
    protected $table = 'produits';
    protected $fillable = [
        'categorie_id',
        'image',
        'nom_produit',
        'marque_produit',
        'description_produit',
        'prix_original',
        'prix',
        'stock',
    ];

    protected $with = ['category'];
    public function category()
    {
        return $this->belongsTo(Category::class, 'categorie_id', 'id');
    }
}
