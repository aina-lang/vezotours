<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    /**
     * Les attributs qui peuvent être assignés en masse.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'vehicule_id',
        'motif',
        'date_depart',
        'date_retour',
        'status',
        'type_voyage',
        'retard',
        'pieces_jointes',
        'destination',
    ];
    /**
     * Les relations du modèle.
     */

    /**
     * Relation avec le modèle User.
     * Une réservation appartient à un utilisateur.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relation avec le modèle Vehicle.
     * Une réservation appartient à un véhicule.
     */
    public function vehicule()
    {
        return $this->belongsTo(Vehicule::class);
    }
}
