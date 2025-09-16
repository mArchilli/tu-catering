<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;

class WarningMailable extends Mailable
{
    use Queueable, SerializesModels;

    public $child;

    public function __construct($child)
    {
        $this->child = $child;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address('info@tucatering.com.ar', 'Tu Catering'),
            subject: 'Recordatorio de inscripción — Tu Catering',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.warning',
            with: [
                'child' => $this->child,
                'padre' => $this->child->user, // <-- agrega el padre para la vista
            ],
        );
    }
}
