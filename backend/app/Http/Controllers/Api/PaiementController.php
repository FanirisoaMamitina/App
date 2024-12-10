<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Facture;
use App\Models\Paiement;
use App\Models\Ventes;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PaiementController extends Controller
{
    public function index()
    {
        $paiement = Paiement::with([
            'vente',
        ])->orderBy('DatePaiement', 'desc')
            ->get();

        return response()->json([
            'status' => 200,
            'paiement' => $paiement,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'idVente' => 'required|exists:ventes,id',
            'MontantPaye' => 'required|numeric|min:0',
            'ModePaiement' => 'required|string|max:50',
            'Ref' => 'nullable|string|max:100',
            'isFacture' => 'boolean', // Indique si une facture doit être créée
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->messages(),
            ]);
        }

        // Créer le paiement
        $paiement = new Paiement;
        $paiement->idVente = $request->input('idVente');
        $paiement->MontantPaye = $request->input('MontantPaye');
        $paiement->ModePaiement = $request->input('ModePaiement');
        $paiement->Ref = $request->input('Ref');
        $paiement->DatePaiement = Carbon::now('Indian/Antananarivo');
        $paiement->save();

        // Mettre à jour la vente
        $vente = Ventes::find($paiement['idVente']);
        $vente->TotalMontantPaye += $paiement['MontantPaye'];
        $vente->MontantRestant = $vente->montant_total - $vente->TotalMontantPaye;
        if ($vente->MontantRestant == 0) {
            $vente->Status = "soldée";
        }
        $vente->save();

        $idFacture = null;

        // Créer la facture si demandé
        if ($request->input('isFacture')) {
            $facture = new Facture;
            $facture->idPaiement = $paiement->id;
            $facture->dateFacture = Carbon::now('Indian/Antananarivo');
            $facture->save();
            $idFacture = $facture->id;
            $dateFact = $facture->dateFacture;

            $venteDetails = Ventes::with([
                'clients',
                'detaille_Vente.produits.category',
                'paiements',
            ])->find($paiement['idVente']);

            return response()->json([
                'status' => 200,
                'message' => 'Paiement ajouté avec succès',
                'idPaiement' => $paiement->id,
                'idFacture' => $idFacture,
                'date' => $dateFact,
                'vente' => $venteDetails
            ]);
        } else {
            return response()->json([
                'status' => 200,
                'message' => 'Paiement ajouté avec succès',
            ]);
        }
    }

    public function getFactureDetails($idVente)
    {
        $vente = Ventes::with([
            'clients',
            'detaille_Vente.produits.category',
            'paiements',
        ])->find($idVente);

        if (!$vente) {
            return response()->json([
                'status' => 404,
                'message' => 'Vente non trouvée',
            ]);
        }

        return response()->json([
            'status' => 200,
            'vente' => $vente,
        ]);
    }


    // public function storeFacture(Request $request)
    // {
    //     $facture = new Facture;
    //     $facture->idPaiement = $request->input('idPaiement');
    //     $facture->save();

    //     return response()->json([
    //         'status' => 200,
    //         'idFacture' => $facture->id,
    //     ]);
    // }

    // protected function enregistrerHistorique($action, $table, $elementId, $details = null)
    // {
    //     \App\Models\HistoriqueAction::create([
    //         'action' => $action,
    //         'table' => $table,
    //         'element_id' => $elementId,
    //         'details' => $details ? json_encode($details) : null,
    //         'user_id' => auth()->id(),
    //     ]);
    // }
}
