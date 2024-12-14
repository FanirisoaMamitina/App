<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    public function index()
    {
        $category = Category::all();
        return response()->json([
            'status'=> 200,
            'category' => $category,
        ]);
    }

    public function all()
    {
        $category = Category::where('status_categorie', '1')->get();
        return response()->json([
            'status'=> 200,
            'category' => $category,
        ]);
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom_categorie' => 'required|max:191',
        ], [
            'nom_categorie.required' => 'Le nom de la catégorie est obligatoire.',
            'nom_categorie.max' => 'Le nom de la catégorie ne peut pas dépasser 191 caractères.',
        ]);

        if($validator->fails())
        {
            return response()->json([
                'status'=>400,
                'errors'=>$validator->messages(),
            ]);
        }else {
            $category = new Category;
            $category->nom_categorie = $request->input('nom_categorie');
            $category->status_categorie = $request->input('status_categorie') == true ? '1' : '0';
            $category->save();
            return response()->json([
                'status'=>200,
                'message'=>'Categorie ajouté avec succès',
            ]);
        }
    }

    public function edit($id)
    {
        $category = Category::find($id);
        if($category)
        {
            return response()->json([
                'status'=>200,
                'category'=>$category
            ]);
        }
        else 
        {
            return response()->json([
                'status'=>404,
                'message'=>'No Category Id Found'
            ]);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nom_categorie'=>'required|max:191',
        ]);

        if($validator->fails())
        {
            return response()->json([
                'status'=>422,
                'errors'=>$validator->messages(),
            ]);
        }else {
            $category = Category::find($id);

            if($category)
            {
                $category->nom_categorie = $request->input('nom_categorie');
                $category->status_categorie = $request->input('status_categorie');
                $category->save();
                return response()->json([
                    'status'=>200,
                    'message'=>'Categorie mis à jour avec succès',
                ]);
            }
            else 
            {
                return response()->json([
                    'status'=>404,
                    'message'=>'No Category Id Found',
                ]);
            }

        }
    }

    public function destroy($id)
    {
        $result = Category::where('id',$id)->delete();
        if($result)
        {
            return response()->json(['result'=>'Categorie supprimé avec succès']);
        }
    }

}
