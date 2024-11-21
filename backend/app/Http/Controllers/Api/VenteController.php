<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ventes;
use App\Models\Detaille_Vente;
use App\Models\Produits;
use Illuminate\Http\Request;

class VenteController extends Controller
{

    public function index()
    {
        $ventes = Ventes::with([
            'clients',
            'detaille_Vente.produits' // Inclure les produits dans les détails de vente
        ])
            ->orderBy('date', 'desc')
            ->get();
    
        return response()->json(['ventes' => $ventes]);
        // $ventes = Ventes::orderBy('id', 'DESC')->get();
        // return response()->json([
        //     'status'=> 200,
        //     'ventes' => $ventes,
        // ]);
    }

    public function getIdMax()
    {
        $venteId = Ventes::max('id'); // Assurez-vous que la table `ventes` contient bien une colonne `id`
        
        return response()->json([
            'status' => 200,
            'venteId' => $venteId,
        ]);
    }

    public function store(Request $request)
    {
        // Validation des données du formulaire
        $validatedData = $request->validate([
            'client' => 'required|exists:clients,id',
            'date' => 'required|date',
            'produits' => 'required|array',
            'produits.*.produit' => 'required|exists:produits,id',
            'produits.*.quantite' => 'required|integer|min:1',
            'montant_total' => 'required|numeric',
        ]);
    
        // Parcourir les produits pour vérifier les stocks avant de continuer
        foreach ($validatedData['produits'] as $produit) {
            $product = Produits::find($produit['produit']);
            if ($product) {
                // Vérifier si la quantité demandée est inférieure ou égale au stock disponible
                if ($product->stock < $produit['quantite']) {
                    return response()->json([
                        'error' => "Le stock du produit {$product->nom} est insuffisant. Disponible: {$product->stock}, demandé: {$produit['quantite']}"
                    ], 400);
                }
            } else {
                return response()->json([
                    'error' => "Le produit avec l'ID {$produit['produit']} n'existe pas."
                ], 404);
            }
        }
    
        // Si tout est OK, continuer avec la création de la vente
        $vente = new Ventes();
        $vente->client_id = $validatedData['client'];
        $vente->date = $validatedData['date'];
        $vente->montant_total = $validatedData['montant_total'];
        $vente->save();
    
        // Insertion des produits dans la table 'detaille_ventes'
        foreach ($validatedData['produits'] as $produit) {
            $product = Produits::find($produit['produit']);
            if ($product) {
                Detaille_Vente::create([
                    'vente_id' => $vente->id,
                    'produit_id' => $product->id,
                    'quantite' => $produit['quantite'],
                    'prix_unitaire' => $product->prix,
                ]);
    
                // Mettre à jour le stock du produit
                $product->stock -= $produit['quantite'];
                $product->save();
            }
        }

        $this->enregistrerHistorique('ajout', 'vente', $vente->id,$product->nom_produit." ".$product->nom_produit." ".$product->marque_produit." ".$product->description_produit );
    
        return response()->json(['message' => 'Vente enregistrée avec succès!'], 200);
    }
    protected function enregistrerHistorique($action, $table, $elementId, $details = null)
    {
        \App\Models\HistoriqueAction::create([
            'action' => $action,
            'table' => $table,
            'element_id' => $elementId,
            'details' => $details ? json_encode($details) : null,
            'user_id' => auth()->id(), // Utilisateur connecté
        ]);
    }
}
