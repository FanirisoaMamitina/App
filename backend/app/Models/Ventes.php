<?php
namespace App\Models;

use App\Models\Clients;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ventes extends Model
{
    use HasFactory;

    protected $table = 'ventes';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'id',
        'client_id',
        'date',
        'montant_total',
        'DateReception',
        'MontantRestant',
        'TotalMontantPaye',
        'Status',
    ];

    protected $with = ['clients'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($vente) {
            $latestVente = self::latest('created_at')->first();
            $nextId = $latestVente ? intval(substr($latestVente->id, 7)) + 1 : 1;
            $vente->id = 'VE' . now()->format('ym') . '-' . str_pad($nextId, 6, '0', STR_PAD_LEFT);
            $vente->date = now('Indian/Antananarivo');
        });
    }
    /**
     * Relation avec le modèle Clients
     */
    public function clients()
    {
        return $this->belongsTo(Clients::class, 'client_id', 'id');
    }

    /**
     * Relation avec le modèle Detaille_Vente
     */
    public function detaille_Vente()
    {
        return $this->hasMany(Detaille_Vente::class, 'vente_id', 'id');
    }

    /**
     * Relation avec le modèle Paiement
     */
    public function paiements()
    {
        return $this->hasMany(Paiement::class, 'idVente', 'id');
    }
}
