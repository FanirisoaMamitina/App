<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facture extends Model
{
    use HasFactory;

    protected $table = 'factures';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'id',
        'idPaiement',
        'dateFacture',
        'description',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($facture) {
            $latestFacture = self::latest('created_at')->first();
            $nextId = $latestFacture ? intval(substr($latestFacture->id, 7)) + 1 : 1;
            $facture->id = 'FA' . now()->format('ym') . '-' . str_pad($nextId, 6, '0', STR_PAD_LEFT);
            $facture->dateFacture = now('Indian/Antananarivo');
        });
    }

    public function paiement()
    {
        return $this->belongsTo(Paiement::class, 'idPaiement', 'id');
    }
}
