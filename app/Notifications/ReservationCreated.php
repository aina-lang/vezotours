<?php
// app/Notifications/ReservationCreated.php

namespace App\Notifications;

use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReservationCreated extends Notification
{
    use Queueable;

    protected $reservation;

    public function __construct(Reservation $reservation)
    {
        $this->reservation = $reservation;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Nouvelle réservation client')
            ->greeting('Bonjour Admin,')
            ->line('Un client a récemment effectué une réservation pour l\'un de nos véhicules.')
            ->line('Détails de la réservation :')
            ->line('Véhicule : ' . $this->reservation->vehicule->marque . ' ' .  $this->reservation->vehicule->modele)
            ->line('Date de départ : ' . Carbon::parse($this->reservation->date_depart)->format('d/m/Y'))
            ->line('Date de retour : ' . Carbon::parse($this->reservation->date_retour)->format('d/m/Y'))
            ->line('Motif du voyage : ' . $this->reservation->motif)
            ->line('Type de voyage : ' . ucfirst($this->reservation->type_voyage))
            ->action('Voir les détails de la réservation', url('/admin/reservations/' . $this->reservation->id))
            ->line('Merci de vérifier cette réservation et de procéder à sa confirmation.');
    }
}
