<?php

namespace App\Models;

use App\Models\Clients;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ventes extends Model
{
    use HasFactory;
    protected $table = 'ventes';
    protected $fillable = [
        'client_id',
        'date',
        'montant_total',
    ];

    protected $with = ['clients'];
    public function clients()
    {
        return $this->belongsTo(Clients::class, 'client_id', 'id');
    }

    public function detaille_Vente()
    {
        return $this->hasMany(Detaille_Vente::class, 'vente_id', 'id');
    }
}
