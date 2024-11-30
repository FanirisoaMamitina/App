<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Clients;
use App\Models\Detaille_Vente;
use App\Models\HistoriqueAction;
use App\Models\Paiement;
use App\Models\Produits;
use App\Models\Ventes;
use Carbon\Carbon;
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
    }

    public function lastId()
    {
        $venteId = Ventes::max('id'); // Assurez-vous que la table `ventes` contient bien une colonne `id`

        return response()->json([
            'status' => 200,
            'venteId' => $venteId,
        ]);
    }

    public function store(Request $request)
    {
        // Validation des données reçues
        $validatedData = $request->validate([
            'client' => 'required', // Validation minimale, vérifier plus en détail selon vos besoins
            'products' => 'required|array',
            'products.*.id' => 'required|exists:produits,id',
            'products.*.quantity' => 'required|integer|min:1',
            'products.*.salePrice' => 'required|numeric',
            'products.*.totalAmount' => 'required|numeric',
            'products.*.benefit' => 'required|numeric',
            'totalAmount' => 'required|numeric',
            'montantPayer' => 'required|numeric|min:0',
            'status' => 'required|in:direct,commande',
            //'date_vente' => 'required|date',
        ]);

        // Vérification des stocks pour chaque produit
        foreach ($validatedData['products'] as $productData) {
            $product = Produits::find($productData['id']);
            if ($product->stock < $productData['quantity']) {
                return response()->json([
                    'error' => "Le stock du produit {$product->nom} est insuffisant. Disponible: {$product->stock}, demandé: {$productData['quantity']}."
                ], 400);
            }
        }

        // Création de la vente
        $vente = new Ventes();
        $vente->client_id = is_numeric($validatedData['client'])
            ? $validatedData['client']
            : $this->createNewClient($validatedData['client']);
        $vente->date = Carbon::now('Indian/Antananarivo');
        $vente->montant_total = $validatedData['totalAmount'];
        $vente->DateReception = $request->input('DateReception');
        $vente->MontantRestant = $validatedData['totalAmount'] - $validatedData['montantPayer'];
        $vente->TotalMontantPaye = $validatedData['montantPayer'];
        $vente->Status = $validatedData['status'];
        $vente->save();

        // Enregistrement des produits dans 'detaille_ventes'
        foreach ($validatedData['products'] as $productData) {
            $product = Produits::find($productData['id']);
            Detaille_Vente::create([
                'vente_id' => $vente->id,
                'produit_id' => $product->id,
                'quantite' => $productData['quantity'],
                'prix_unitaire' => $productData['salePrice'],
            ]);

            // Mise à jour du stock
            $product->stock -= $productData['quantity'];
            $product->save();
        }

        // Enregistrement dans l'historique
        $this->enregistrerHistorique(
            'ajout',
            'vente',
            $vente->id,
            "Vente avec ID: {$vente->id}, Client: {$vente->client_id}, Total: {$vente->montant_total}"
        );

        return response()->json(['message' => 'Vente enregistrée avec succès!', 'vente_id' => $vente->id], 200);
    }

    /**
     * Fonction pour gérer les nouveaux clients
     */
    private function createNewClient($clientData)
    {
        $client = Clients::create([
            'nom' => $clientData['nom'],
            'tel' => $clientData['tel'],
            // Ajouter d'autres champs nécessaires
        ]);
        return $client->id;
    }

    public function getInfoById($id)
    {
        $vente = Ventes::find($id);
        if ($vente) {
            return response()->json([
                'status' => 200,
                'vente' => $vente
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'No vente Id Found'
            ]);
        }
    }

    public function getInfoVentePaiementById($id)
    {
        $vente = Ventes::with([
            'paiements',
            'clients',
            'detaille_Vente.produits'
        ])->find($id);

        if ($vente) {
            return response()->json([
                'status' => 200,
                'vente' => $vente,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'No vente Id Found',
            ]);
        }
    }



    /**
     * Fonction pour enregistrer les actions dans l'historique
     */
    protected function enregistrerHistorique($action, $table, $elementId, $details = null)
    {
        \App\Models\HistoriqueAction::create([
            'action' => $action,
            'table' => $table,
            'element_id' => $elementId,
            'details' => $details ? json_encode($details) : null,
            'user_id' => auth()->id(),
        ]);
    }
}
