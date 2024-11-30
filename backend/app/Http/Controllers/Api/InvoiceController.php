<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\InvoiceMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class InvoiceController extends Controller
{
    public function sendInvoice(Request $request)
    {
        // Valider l'email
        $request->validate([
            'file' => 'required|file|mimes:pdf|max:10240', // Max 10MB
            'email' => 'required|email',
        ]);

        // Sauvegarder le fichier PDF temporairement
        $file = $request->file('file');
        $path = $file->storeAs('invoices', $file->getClientOriginalName());

        // Envoyer l'email avec la pièce jointe
        Mail::to($request->email)->send(new InvoiceMail($path));

        // Réponse
        return response()->json(['message' => 'Facture envoyée avec succès'], 200);
    }
}
