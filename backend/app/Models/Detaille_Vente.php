<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Detaille_Vente extends Model
{
    use HasFactory;
    protected $table = 'detaille_ventes';
    protected $fillable = [
        'vente_id',
        'produit_id',
        'quantite',
        'prix_unitaire',
    ];

    // Relations
    public function ventes()
    {
        return $this->belongsTo(Ventes::class, 'vente_id', 'id');
    }

    public function produits()
    {
        return $this->belongsTo(Produits::class, 'produit_id', 'id');
    }
}
