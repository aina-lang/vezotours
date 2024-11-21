<?php

namespace App\Jobs;

use App\Models\Reservation;
use App\Notifications\RetardNotification;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CheckReservationRetard implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Exécute le job.
     */
    public function handle()
    {
        // Récupérer toutes les réservations dont la date de retour est dépassée et qui ne sont pas encore marquées en retard
        $reservations = Reservation::where('date_retour', '<', Carbon::now())
                                   ->where('retard', false)
                                   ->get();

        foreach ($reservations as $reservation) {
            // Marquer la réservation comme en retard
            $reservation->retard = true;

            // Calculer le nombre de jours de retard
            $daysLate = Carbon::now()->diffInDays($reservation->date_retour);

            // Calculer les frais de retard (par exemple, 50 unités par jour de retard)
            $fraisRetard = $daysLate * 50;
            $reservation->frais_retard = $fraisRetard;
            $reservation->save();

            // Notifier l'utilisateur du retard
            $reservation->user->notify(new RetardNotification($reservation));
        }
    }
}
