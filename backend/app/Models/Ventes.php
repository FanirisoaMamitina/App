<?php

namespace App\Models;

use App\Models\Clients;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ventes extends Model
{
    use HasFactory;

    protected $table = 'ventes';

    // Colonnes pouvant être remplies en masse
    protected $fillable = [
        'client_id',
        'date',
        'montant_total',
        'DateReception',
        'MontantRestant',
        'TotalMontantPaye',
        'Status',
    ];

    // Chargement automatique de la relation avec les clients
    protected $with = ['clients'];

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
}
