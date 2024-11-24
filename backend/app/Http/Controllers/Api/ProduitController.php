<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HistoriqueAction;
use App\Models\Produits;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ProduitController extends Controller
{
    public function index()
    {
        $product = Produits::all();
        return response()->json([
            'status' => 200,
            'product' => $product,
        ]);
    }

    public function getProduitsDisponibles()
    {
        $product = Produits::where('stock', '>', 0)->get();

        return response()->json([
            'product' => $product
        ]);
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'categorie_id' => 'required|max:191',
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'nom_produit' => 'required|max:191',
            'marque_produit' => 'required|max:191',
            'description_produit' => 'required|max:191',
            'prix_original' => 'required|max:191',
            'stock' => 'required|max:191',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages(),
            ]);
        } else {
            $product = new Produits;
            $product->categorie_id = $request->input('categorie_id');
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $extension = $file->getClientOriginalExtension();
                $filename = time() . '.' . $extension;
                $file->move('uploads/product/', $filename);
                $product->image = 'uploads/product/' . $filename;
            }
            $product->nom_produit = $request->input('nom_produit');
            $product->marque_produit = $request->input('marque_produit');
            $product->description_produit = $request->input('description_produit');
            $product->prix_original = $request->input('prix_original');
            $product->stock = $request->input('stock');
            $product->save();

            $this->enregistrerHistorique('ajout', 'produits', $product->id,$product->nom_produit." ".$product->nom_produit." ".$product->marque_produit." ".$product->description_produit );

            return response()->json([
                'status' => 200,
                'message' => 'Product Added Successfully',
            ]);
        }
    }

    public function getInfoProduits($id)
    {
        $product = Produits::find($id);
        if ($product) {
            return response()->json([
                'status' => 200,
                'product' => $product
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'No product Id Found'
            ]);
        }
    }


    public function edit($id)
    {
        $product = Produits::find($id);
        if ($product) {
            return response()->json([
                'status' => 200,
                'product' => $product
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'No Product Id Found'
            ]);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'categorie_id' => 'required|max:191',
            'nom_produit' => 'required|max:191',
            'marque_produit' => 'required|max:191',
            'description_produit' => 'required',
            'prix_original' => 'required|numeric',
            'stock' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 422, 'errors' => $validator->messages()]);
        }

        $product = Produits::find($id);
        if (!$product) {
            return response()->json(['status' => 404, 'message' => 'Produit non trouvé']);
        }

        $product->categorie_id = $request->input('categorie_id');
        $product->nom_produit = $request->input('nom_produit');
        $product->marque_produit = $request->input('marque_produit');
        $product->description_produit = $request->input('description_produit');
        $product->prix_original = $request->input('prix_original');
        $product->stock = $request->input('stock');

        if ($request->hasFile('image')) {
            // Supprime l'ancienne image si elle existe
            if (file_exists(public_path($product->image)) && $product->image) {
                unlink(public_path($product->image));
            }

            // Enregistre la nouvelle image
            $file = $request->file('image');
            $filename = time() . '.' . $file->getClientOriginalExtension();
            $file->move('uploads/product/', $filename);
            $product->image = 'uploads/product/' . $filename;
        }

        $product->save();

        $this->enregistrerHistorique('modification', 'produits', $id, $product->nom_produit." ".$product->nom_produit." ".$product->marque_produit." ".$product->description_produit );

        return response()->json(['status' => 200, 'message' => 'Produit mis à jour avec succès']);
    }



    public function destroy($id)
    {
        $product = Produits::findOrFail($id);
        $product->delete();
        // $result = Produits::where('id', $id)->delete();

        $this->enregistrerHistorique('suppression', 'produits', $id, $product->nom_produit." ".$product->nom_produit." ".$product->marque_produit." ".$product->description_produit );
        return response()->json(['result' => 'Product has been deleted']);
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

    public function historique()
    {
        $historique = \App\Models\HistoriqueAction::with('user')->latest()->get();
        return response()->json(['status' => 200, 'historique' => $historique]);
    }
}
