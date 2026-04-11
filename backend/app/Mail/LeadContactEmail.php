<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class LeadContactEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $messageBody;
    public $subject;

    public function __construct($subject, $messageBody)
    {
        $this->subject = $subject;
        $this->messageBody = $messageBody;
    }

    public function build()
    {
        return $this->subject($this->subject)
                    ->html(nl2br(e($this->messageBody)));
    }
}
