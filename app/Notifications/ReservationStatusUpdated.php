<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReservationStatusUpdated extends Notification
{
    use Queueable;

    protected $reservation;
    protected $status;

    public function __construct($reservation, $status)
    {
        $this->reservation = $reservation;
        $this->status = $status;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $mailMessage = (new MailMessage)
            ->greeting('Bonjour ' . $notifiable->name);
    
        switch ($this->status) {
            case 'confirmée':
                $mailMessage->subject('Confirmation de votre réservation')
                    ->line('Nous avons le plaisir de vous informer que votre réservation a été confirmée.')
                    ->line('Merci de votre confiance et bonne route !');
                break;
            default:
                $mailMessage->subject('Mise à jour de votre réservation')
                    ->line('Le statut de votre réservation a été mis à jour.')
                    ->line('Statut actuel : ' . ucfirst($this->status));
                break;
        }
    
        return $mailMessage
            ->action('Voir votre réservation', url('/reservations/' . $this->reservation->id))
            ->line('Merci d\'avoir choisi notre service!');
    }
    
}
