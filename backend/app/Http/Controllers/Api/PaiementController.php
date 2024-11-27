<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Paiement;
use App\Models\Ventes;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PaiementController extends Controller
{
    public function store(Request $request)
{
    // Validation des données d'entrée
    $validator = Validator::make($request->all(), [
        'idVente' => 'required|exists:ventes,id',
        'MontantPaye' => 'required|numeric|min:0',
        'ModePaiement' => 'required|string|max:50',
        'Ref' => 'nullable|string|max:100',
        // 'DatePaiement' => 'required|date',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => 400,
            'errors' => $validator->messages(),
        ]);
    }

    $paiement = new Paiement;
    $paiement->idVente = $request->input('idVente');
    $paiement->MontantPaye = $request->input('MontantPaye');
    $paiement->ModePaiement = $request->input('ModePaiement');
    $paiement->Ref = $request->input('Ref');
    $paiement->DatePaiement = Carbon::now('Indian/Antananarivo');
    $paiement->save();

    $vente = Ventes::find($paiement['idVente']);
    $vente->TotalMontantPaye += $paiement['MontantPaye'];
    $vente->MontantRestant = $vente->montant_total - $vente->TotalMontantPaye;
    if($vente->MontantRestant == 0){
        $vente->Status = "soldée";
    }
    $vente->save();
    // Historique
    // $this->enregistrerHistorique(
    //     'ajout',
    //     'paiements',
    //     $paiement->id,
    //     "Montant : {$paiement->montant_paye}, Vente : {$paiement->id_vente}"
    // );

    // Réponse de succès
    return response()->json([
        'status' => 200,
        'message' => 'Paiement ajouté avec succès',
    ]);
}

}
