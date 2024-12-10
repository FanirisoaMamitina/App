<?php

namespace App\Http\Controllers\Api;

use App\Events\NotificationEvent;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Produits;

class NotificationController extends Controller
{
    public function notifyLowStock($productId)
    {
        $product = Produits::findOrFail($productId);

        if ($product->stock < 5) {
            broadcast(new NotificationEvent(
                "Stock faible pour le produit : {$product->nom_produit}",
                $product->id
            ));
        }

        return response()->json(['message' => 'Notification envoyée']);
    }
}
