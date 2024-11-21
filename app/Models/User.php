<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nom',
        'prenoms',
        'email',
        'password',
        'type',
        'pieces_jointes',
        'phones',
        // 'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    protected function type(): Attribute
    {
        return new Attribute(get: fn($value) => ["user", "admin"][$value]);
    }


    protected $casts = [
        'phones' => 'array', // Cast the phones attribute as an array
    ];

    /**
     * Getter pour les numéros de téléphone
     */
    public function getPhonesAttribute($value)
    {
        return $value ?: []; // Retourne un tableau vide si aucune valeur n'est définie
    }

    /**
     * Ajouter un numéro de téléphone
     */
    public function addPhone($phone)
    {
        $phones = $this->phones; // Récupérer le tableau actuel
        $phones[] = $phone; // Ajouter le nouveau numéro
        $this->phones = $phones; // Mettre à jour le tableau
        $this->save(); // Enregistrer les modifications
    }

    /**
     * Supprimer un numéro de téléphone
     */
    public function removePhone($phone)
    {
        $phones = $this->phones; // Récupérer le tableau actuel
        $this->phones = array_filter($phones, fn($p) => $p !== $phone); // Filtrer le tableau pour enlever le numéro
        $this->save(); // Enregistrer les modifications
    }

    public function avis()
    {
        return $this->hasMany(Avis::class, 'user_id');
    }
}
