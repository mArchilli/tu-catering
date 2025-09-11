<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactMessage extends Mailable
{
    use Queueable, SerializesModels;

    public string $name;
    public string $emailAddress;
    public string $content;

    public function __construct(string $name, string $emailAddress, string $content)
    {
        $this->name = $name;
        $this->emailAddress = $emailAddress;
        $this->content = $content;
    }

    public function build()
    {
        return $this->subject('Nueva consulta desde la web')
            ->from('info@tucatering.com.ar', 'Tu Catering')
            ->replyTo($this->emailAddress, $this->name)
            ->view('emails.contact', [
                'name' => $this->name,
                'email' => $this->emailAddress,
                'content' => $this->content,
            ]);
    }
}
