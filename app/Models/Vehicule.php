<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicule extends Model
{
    use HasFactory;

    protected $fillable = [
        'marque',
        'modele',
        'immatriculation',
        'categorie_id',
        'kilometrage',
        'date_ajout',
        'description',
        'images',
    ];

    public function categorie(){ 
        return $this->belongsTo(Categorie::class); 
    }
    public function reservations(){ 
        return $this->hasMany(Reservation::class); 
    }
    public function avis(){ 
        return $this->hasMany(Avis::class); 
    }
}
