<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $table = 'categories';
    protected $fillable = [
        'nom_categorie',
        'status_categorie',
    ];

    /**
     * Relation avec le modèle Produits
     */
    public function produits()
    {
        return $this->hasMany(Produits::class, 'categorie_id', 'id');
    }
}

