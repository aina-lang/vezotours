<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class NewRegistrationNotification extends Notification
{
    protected $client;

    public function __construct($client)
    {
        $this->client = $client;
    }

    public function toArray($notifiable)
    {
        return [
            'client_id' => $this->client->id,
            'client_name' => $this->client->name,
            // Ajoutez d'autres informations pertinentes
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'client_id' => $this->client->id,
            'client_name' => $this->client->name,
        ]);
    }

    public function broadcastType()
    {
        return 'new.registration';
    }
}
