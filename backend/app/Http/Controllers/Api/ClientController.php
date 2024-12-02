<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Clients;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ClientController extends Controller
{
    public function index()
    {
        $client = Clients::all();
        return response()->json([
            'status'=> 200,
            'client' => $client,
        ]);
    }

    public function getInfoById($id)
    {
        $client = Clients::find($id);
        if($client)
        {
            return response()->json([
                'status'=>200,
                'client'=>$client
            ]);
        }
        else 
        {
            return response()->json([
                'status'=>404,
                'message'=>'No Client Id Found'
            ]);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom'=>'required|max:191',
            'tel'=>'required|max:15',
        ]);

        if($validator->fails())
        {
            return response()->json([
                'status'=>400,
                'errors'=>$validator->messages(),
            ]);
        }else {
            $client = new Clients;
            $client->nom = $request->input('nom');
            $client->tel = $request->input('tel');
            $client->save();
            $this->enregistrerHistorique('ajout', 'clients', $client->id,$client->nom." ".$client->tel);
            return response()->json([
                'status'=>200,
                'message'=>'Client Ajouter Success',
            ]);
        }
    }

    public function edit($id)
    {
        $client = Clients::find($id);
        if($client)
        {
            return response()->json([
                'status'=>200,
                'client'=>$client
            ]);
        }
        else 
        {
            return response()->json([
                'status'=>404,
                'message'=>'No Client Id Found'
            ]);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nom'=>'required|max:191',
            'tel'=>'required|max:15',
        ]);

        if($validator->fails())
        {
            return response()->json([
                'status'=>422,
                'errors'=>$validator->messages(),
            ]);
        }else {
            $client = Clients::find($id);

            if($client)
            {
                $client->nom = $request->input('nom');
                $client->tel = $request->input('tel');
                $client->save();
                $this->enregistrerHistorique('modification', 'clients', $id, $client->nom." ".$client->tel);
                return response()->json([
                    'status'=>200,
                    'message'=>'Client Edited Successfully',
                ]);
            }
            else 
            {
                return response()->json([
                    'status'=>404,
                    'message'=>'No Client Id Found',
                ]);
            }

        }
    }

    public function destroy($id)
    {
        $result = Clients::where('id',$id)->delete();
        if($result)
        {
             $this->enregistrerHistorique('suppression', 'clients', $id,  $result->id,$result->nom." ".$result->tel);
            return response()->json(['result'=>'Client has been deleted']);
        }
    }

    public function search($key)
    {
        return $key = Clients::where('nom','LIKE', "%$key%")->get();
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
