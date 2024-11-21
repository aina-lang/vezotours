<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceType extends Model
{
    use HasFactory;

    // Nom de la table
    protected $table = 'service_types';

    // Champs fillable pour la création en masse
    protected $fillable = [
        'nom',
        'description',
    ];

    // Relation avec les prestations (un type de service peut avoir plusieurs prestations)
    public function prestations()
    {
        return $this->hasMany(Prestation::class, 'service_type_id');
    }
}
