<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Clients;
use App\Models\Detaille_Vente;
use App\Models\Produits;
use App\Models\Ventes;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class DashboardController extends Controller
{
    public function getStats()
    {
        $totalVentes = Ventes::sum('montant_total');

        $nombreClients = Clients::count();

        $beneficeTotal = Ventes::join('detaille_ventes', 'ventes.id', '=', 'detaille_ventes.vente_id')
            ->join('produits', 'detaille_ventes.produit_id', '=', 'produits.id')
            ->select(DB::raw('SUM((detaille_ventes.quantite * detaille_ventes.prix_unitaire) - (detaille_ventes.quantite * produits.prix_original)) AS benefice'))
            ->first()
            ->benefice;

        $produitsFaibleStock = Produits::where('stock', '<', 5)
            ->select('id', 'nom_produit', 'stock')
            ->get();

        $produitsLesPlusVendus = Detaille_Vente::select('produit_id', DB::raw('SUM(quantite) as total_vendus'))
            ->groupBy('produit_id')
            ->orderBy('total_vendus', 'DESC')
            ->take(6)
            ->with('produits') 
            ->get();

        $ventesParCategorie = DB::table('detaille_ventes')
            ->join('produits', 'detaille_ventes.produit_id', '=', 'produits.id')
            ->join('categories', 'produits.categorie_id', '=', 'categories.id')
            ->select('categories.nom_categorie', DB::raw('SUM(detaille_ventes.quantite * detaille_ventes.prix_unitaire) as total'))
            ->groupBy('categories.nom_categorie')
            ->get();

        $ventesEvolution = Ventes::select(DB::raw('DATE(date) as date'), DB::raw('SUM(montant_total) as total'))
            ->groupBy(DB::raw('DATE(date)'))
            ->orderBy('date', 'ASC')
            ->get();

        return response()->json([
            'totalVentes' => $totalVentes,
            'nombreClients' => $nombreClients,
            'beneficeTotal' => $beneficeTotal,
            'produitsFaibleStock' => $produitsFaibleStock,
            'ventesParCategorie' => $ventesParCategorie,
            'ventesEvolution' => $ventesEvolution,
            'produitsLesPlusVendus' => $produitsLesPlusVendus,
        ]);
    }

    public function getHistoriqueVentes()
    {
        $ventes = Ventes::with([
            'clients',
            'detaille_Vente.produits' // Inclure les produits dans les détails de vente
        ])->where('Status', '=', 'soldée' )
            ->orderBy('date', 'desc')
            ->limit(6) // Affiche les 6 ventes les plus récentes
            ->get();
    
        return response()->json(['ventes' => $ventes]);
    }
    
}

