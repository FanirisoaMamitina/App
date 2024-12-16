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
            'detaille_Vente.produits'
        ])
            ->whereIn('type_vente', ['commande', 'direct'])
            ->orderBy('date', 'desc')
            ->get();

        return response()->json(['ventes' => $ventes]);
    }

    public function indexAnnule()
    {
        $ventes = Ventes::with([
            'clients',
            'detaille_Vente.produits'
        ])
            ->where('type_vente', 'annulé')
            ->orderBy('date', 'desc')
            ->get();

        return response()->json(['ventes' => $ventes]);
    }

    public function lastId()
    {
        $venteId = Ventes::max('id');

        return response()->json([
            'status' => 200,
            'venteId' => $venteId,
        ]);
    }

    public function store(Request $request)
    {

        $validatedData = $request->validate([
            'client' => 'required',
            'products' => 'required|array',
            'products.*.id' => 'required|exists:produits,id',
            'products.*.quantity' => 'required|integer|min:1',
            'products.*.salePrice' => 'required|numeric',
            'products.*.totalAmount' => 'required|numeric',
            'products.*.benefit' => 'required|numeric',
            'totalAmount' => 'required|numeric',
            'montantPayer' => 'required|numeric|min:0',
            'type' => 'required|in:direct,commande',
        ]);

        // Vérification des stocks pour chaque produit
        foreach ($validatedData['products'] as $productData) {
            $product = Produits::find($productData['id']);
            if ($product->stock < $productData['quantity']) {
                return response()->json([
                    'error' => "Le stock du produit {$product->nom_produit} est insuffisant. Disponible: {$product->stock}, demandé: {$productData['quantity']}."
                ], 400);
            }
        }

        // Création de la vente
        $vente = new Ventes();
        $vente->client_id = is_string($validatedData['client'])
            ? $validatedData['client']
            : $this->createNewClient($validatedData['client']);
        // $vente->date = Carbon::now('Indian/Antananarivo');
        $vente->montant_total = $validatedData['totalAmount'];
        $vente->DateReception = $request->input('DateReception');
        $vente->MontantRestant = $validatedData['totalAmount'] - $validatedData['montantPayer'];
        $vente->TotalMontantPaye = $validatedData['montantPayer'];
        $vente->type_vente = $validatedData['type'];
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

    public function updateReception(Request $request, $id)
    {
        $vente = Ventes::find($id);

        if ($vente) {
            $vente->statut_reception = "reçu";
            $vente->save();
            return response()->json(['status' => 200, 'message' => 'Produit a réceptionné.']);
        }
    }

    public function recoverCancelledSaleToCommand($id)
    {
        $vente = Ventes::find($id);

        if (!$vente) {
            return response()->json([
                'status' => 404,
                'message' => 'Vente introuvable.',
            ], 404);
        }
        if ($vente->type_vente !== 'annulé') {
            return response()->json([
                'status' => 400,
                'message' => 'Cette vente n\'est pas annulée.',
            ], 400);
        }

        $detailsVente = Detaille_Vente::where('vente_id', $id)->get();

        if ($detailsVente->isEmpty()) {
            return response()->json([
                'status' => 400,
                'message' => 'Aucun détail de vente trouvé pour cette vente.',
            ], 400);
        }

        foreach ($detailsVente as $detail) {
            $produit = Produits::find($detail->produit_id);

            if (!$produit) {
                return response()->json([
                    'status' => 404,
                    'message' => "Produit avec ID {$detail->produit_id} introuvable.",
                ], 404);
            }

            if ($produit->stock < $detail->quantite) {
                return response()->json([
                    'status' => 400,
                    'message' => "Le produit {$produit->nom_produit} n'a pas assez de stock pour cette récupération. Disponible: {$produit->stock}, requis: {$detail->quantite}.",
                ], 400);
            }
        }

        foreach ($detailsVente as $detail) {
            $produit = Produits::find($detail->produit_id);
            $produit->stock -= $detail->quantite;
            $produit->save();
        }

        $vente->type_vente = 'commande';
        $vente->save();

        $this->enregistrerHistorique(
            'modification',
            'ventes',
            $vente->id,
            "Recuperation de la vente annulee avec ID: {$vente->id} en commande."
        );

        return response()->json([
            'status' => 200,
            'message' => 'Vente annulée récupérée avec succès ',
        ]);
    }


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

    public function cancelSale($id)
    {
        $vente = Ventes::find($id);
        if (!$vente) {
            return response()->json([
                'status' => 404,
                'message' => 'Vente introuvable.',
            ], 404);
        }
        if ($vente->type_vente === 'annulé') {
            return response()->json([
                'status' => 400,
                'message' => 'Cette vente a déjà été annulée.',
            ], 400);
        }

        $detailsVente = Detaille_Vente::where('vente_id', $id)->get();

        if ($detailsVente->isEmpty()) {
            return response()->json([
                'status' => 400,
                'message' => 'Aucun détail de vente trouvé pour cette vente.',
            ], 400);
        }

        foreach ($detailsVente as $detail) {
            $produit = Produits::find($detail->produit_id);

            if ($produit) {
                $produit->stock += $detail->quantite;
                $produit->save();
            }
        }

        $vente->type_vente = 'annulé';
        $vente->save();

        $this->enregistrerHistorique(
            'annulation',
            'ventes',
            $vente->id,
            "Annulation de la vente avec ID: {$vente->id}."
        );

        return response()->json([
            'status' => 200,
            'message' => 'Vente annulée avec succès.',
        ]);
    }


    public function delete($id)
    {
        $vente = Ventes::with(['detaille_Vente', 'paiements'])->find($id);

        if (!$vente) {
            return response()->json([
                'status' => 404,
                'message' => "Vente introuvable."
            ], 404);
        }

        if ($vente->paiements) {
            Paiement::where('idVente', $vente->id)->delete();
        }

        if ($vente->detaille_Vente) {
            Detaille_Vente::where('vente_id', $vente->id)->delete();
        }

        $vente->delete();

        $this->enregistrerHistorique(
            'suppression',
            'vente',
            $vente->id,
            "Suppression de la vente avec ID: {$vente->id}, Client: {$vente->client_id}, Total: {$vente->montant_total}"
        );

        return response()->json([
            'status' => 200,
            'message' => "Vente supprimée avec succès."
        ], 200);
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
