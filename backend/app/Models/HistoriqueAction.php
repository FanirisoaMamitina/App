<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistoriqueAction extends Model
{
    use HasFactory;

    protected $fillable = ['action', 'table', 'element_id', 'details', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
