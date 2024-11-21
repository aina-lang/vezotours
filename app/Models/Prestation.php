<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prestation extends Model
{
    use HasFactory;

    protected $table = 'prestations';

    // Champs fillable pour la création en masse
    protected $fillable = [
        'nom',
        'description',
        'service_type_id',
        'status',
    ];

    // Relation avec le type de service (plusieurs prestations pour un type de service)
    public function serviceType()
    {
        return $this->belongsTo(ServiceType::class, 'service_type_id');
    }

    // Relation avec l'administrateur (plusieurs prestations pour un administrateur)

}
