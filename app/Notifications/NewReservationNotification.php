<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class NewReservationNotification extends Notification
{
    protected $reservation;

    public function __construct($reservation)
    {
        $this->reservation = $reservation;
    }

    public function toArray($notifiable)
    {
        return [
            'reservation_id' => $this->reservation->id,
            'client_name' => $this->reservation->client->name,
            // Ajoutez d'autres informations pertinentes
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'reservation_id' => $this->reservation->id,
            'client_name' => $this->reservation->client->name,
        ]);
    }

    public function broadcastType()
    {
        return 'new.reservation';
    }
}
