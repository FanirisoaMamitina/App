<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produits extends Model
{
    use HasFactory;
    protected $table = 'produits';
    public $incrementing = false; 
    protected $keyType = 'string'; 
    protected $fillable = [
        'id',
        'categorie_id',
        'image',
        'nom_produit',
        'marque_produit',
        'description_produit',
        'prix_original',
        'stock',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($produit) {
            $latestProduit = self::latest('created_at')->first();
            $nextId = $latestProduit ? intval(substr($latestProduit->id, 7)) + 1 : 1;
            $produit->id = 'PD' . now()->format('ym') . '-' . str_pad($nextId, 6, '0', STR_PAD_LEFT);
        });
    }

    protected $with = ['category'];
    public function category()
    {
        return $this->belongsTo(Category::class, 'categorie_id', 'id');
    }
}
