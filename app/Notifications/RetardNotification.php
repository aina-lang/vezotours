<?php

namespace App\Notifications;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RetardNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $reservation;

    /**
     * Create a new notification instance.
     */
    public function __construct(Reservation $reservation)
    {
        $this->reservation = $reservation;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail']; // Vous pouvez aussi ajouter 'database' pour enregistrer la notification en base
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $daysLate = now()->diffInDays($this->reservation->date_retour);
        $fraisRetard = $this->reservation->frais_retard;

        return (new MailMessage)
            ->subject('Notification de retard sur votre réservation')
            ->greeting('Bonjour ' . $notifiable->name . ',')
            ->line('Nous vous informons que votre réservation est en retard.')
            ->line("Le retour était prévu pour le " . $this->reservation->date_retour->format('d/m/Y') . ".")
            ->line("Le nombre de jours de retard est de : " . $daysLate . " jours.")
            ->line("Les frais de retard s'élèvent à : " . $fraisRetard . " unités.")
            ->action('Voir votre réservation', url('/reservations/' . $this->reservation->id))
            ->line('Merci d\'utiliser notre service de réservation.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'reservation_id' => $this->reservation->id,
            'frais_retard' => $this->reservation->frais_retard,
            'date_retour' => $this->reservation->date_retour->format('d/m/Y'),
            'jours_retard' => now()->diffInDays($this->reservation->date_retour),
        ];
    }
}
