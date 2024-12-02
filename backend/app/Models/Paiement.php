<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    use HasFactory;

    protected $table = 'paiements';
    public $incrementing = false; // Désactive l'auto-incrémentation pour `id`
    protected $keyType = 'string'; // Type de la clé primaire

    protected $fillable = [
        'id',
        'idVente', // clé étrangère vers la table `ventes`
        'Ref',
        'MontantPaye',
        'DatePaiement',
        'ModePaiement',
    ];

    // Génération de l'ID personnalisé
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($paiement) {
            $latestPaiement = self::latest('created_at')->first();
            $nextId = $latestPaiement ? intval(substr($latestPaiement->id, 4)) + 1 : 1;
            $paiement->id = 'PAY-' . str_pad($nextId, 6, '0', STR_PAD_LEFT);
        });
    }

    /**
     * Relation avec le modèle Ventes
     */
    public function vente()
    {
        return $this->belongsTo(Ventes::class, 'idVente', 'id');
    }
}
