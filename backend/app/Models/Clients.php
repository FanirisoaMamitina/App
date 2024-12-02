<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Clients extends Model
{
    use HasFactory;

    protected $table = 'clients';
    public $incrementing = false; // Désactiver l'auto-incrémentation
    protected $keyType = 'string'; // Type de clé primaire

    protected $fillable = [
        'id',
        'nom',
        'tel',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($client) {
            $latestClient = self::latest('created_at')->first();
            $nextId = $latestClient ? intval(substr($latestClient->id, 7)) + 1 : 1;
            $client->id = 'CU' . now()->format('ym') . '-' . str_pad($nextId, 6, '0', STR_PAD_LEFT);
        });
    }
    /**
     * Relation avec le modèle Ventes
     */
    public function ventes()
    {
        return $this->hasMany(Ventes::class, 'client_id', 'id');
    }
}
