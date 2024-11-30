<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\PaiementController;
use App\Http\Controllers\Api\ProduitController;
use App\Http\Controllers\Api\VenteController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {

    //Category
    Route::get('view-category', [CategoryController::class, 'index']);
    Route::get('all-category', [CategoryController::class, 'all']);
    Route::post('store-category', [CategoryController::class, 'store']);
    Route::get('edit-category/{id}', [CategoryController::class, 'edit']);
    Route::put('update-category/{id}', [CategoryController::class, 'update']);
    Route::delete('delete-category/{id}', [CategoryController::class, 'destroy']);

    //Clients
    Route::get('view-clients', [ClientController::class, 'index']);
    Route::post('store-clients', [ClientController::class, 'store']);
    Route::get('edit-client/{id}', [ClientController::class, 'edit']);
    Route::get('get-client/{id}', [ClientController::class, 'getInfoById']);
    Route::put('update-client/{id}', [ClientController::class, 'update']);
    Route::delete('delete-client/{id}', [ClientController::class, 'destroy']);
    Route::get('search-client/{key}', [ClientController::class, 'search']);


    //Produits
    Route::get('view-produits', [ProduitController::class, 'index']);
    Route::get('get-produits-disponibles', [ProduitController::class, 'getProduitsDisponibles']);
    Route::get('get-produit/{id}', [ProduitController::class, 'getInfoProduits']);
    Route::put('update-produit/{id}', [ProduitController::class, 'update']);
    Route::delete('delete-produit/{id}', [ProduitController::class, 'destroy']);
    Route::get('edit-product/{id}', [ProduitController::class, 'edit']);
    Route::post('update-product/{id}', [ProduitController::class, 'update']);
    Route::post('store-product', [ProduitController::class, 'store']);
    Route::get('historique-actions', [ProduitController::class, 'historique']);

    //Ventes
    Route::get('view-ventes', [VenteController::class, 'index']);
    Route::get('ventes/{id}', [VenteController::class, 'getInfoById']);
    Route::post('store-vente', [VenteController::class, 'store']);
    Route::get('lastId', [VenteController::class], 'lastId');

    //Paiement
    Route::post('store-paiement', [PaiementController::class, 'store']);

    //Dashboard
    Route::get('stats-ventes', [DashboardController::class, 'getStats']);
    Route::get('historique-ventes', [DashboardController::class, 'getHistoriqueVentes']);

    Route::post('send-invoice', [InvoiceController::class, 'sendInvoice']);
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
