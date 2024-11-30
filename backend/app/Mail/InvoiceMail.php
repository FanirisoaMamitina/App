<?php
namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class InvoiceMail extends Mailable
{
    use SerializesModels;

    public $filePath;

    public function __construct($filePath)
    {
        $this->filePath = $filePath;
    }

    public function build()
    {
        return $this->subject('Votre Facture')
                    ->view('emails.invoice')
                    ->attach(storage_path('app/'.$this->filePath), [
                        'as' => 'facture.pdf',
                        'mime' => 'application/pdf',
                    ]);
    }
}
