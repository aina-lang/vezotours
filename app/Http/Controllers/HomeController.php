<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use App\Models\Prestation;
use App\Models\Reservation;
use App\Models\ServiceType;
use App\Models\Vehicule;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index(Request $request)
    {
        $currentDate = now(); // Récupérer la date actuelle

        $latestVehicles = Vehicule::with("avis.user")->latest()->take(6)->get()->map(function ($vehicle) use ($currentDate) {
            // Decode the JSON images
            $vehicle->images = json_decode($vehicle->images);

            // Vérifier la disponibilité du véhicule en fonction de la date actuelle
            $reservationExists = Reservation::where('vehicule_id', $vehicle->id)
                ->where(function ($query) use ($currentDate) {
                    $query->where('date_depart', '<=', $currentDate)
                        ->where('date_retour', '>=', $currentDate);
                })
                ->exists();

            // Vérifier si l'utilisateur est authentifié
            $userId = Auth::id();
            $reservation = null;

            if ($userId) {
                // Si l'utilisateur est connecté, vérifier ses réservations
                $reservation = Reservation::where('user_id', $userId)
                    ->where('vehicule_id', $vehicle->id)
                    ->first();

                // Vérifier si le véhicule est réservé par l'utilisateur
                $vehicle->isReservedByUser = $reservation ? true : false;
            } else {
                // Si l'utilisateur n'est pas connecté, récupérer toutes les réservations pour le véhicule
                $reservation = Reservation::where('vehicule_id', $vehicle->id)->get();
            }


            $vehicle->unavailableDates = Reservation::where("id", $vehicle->id)->get()->map(function ($reservation) {
                return [
                    'start' => $reservation->date_depart,
                    'end' => $reservation->date_retour,
                ];
            })->toArray();


            // dump($reservation);
            // exit;
            // Si le véhicule a une réservation qui est confirmée, il n'est pas disponible
            $vehicle->disponible = true;

            if ($reservation && $reservation->first()) {
                $vehicle->disponible = $reservationExists == false && !($reservation && $reservation->where('status', 'confirmée'));
                $vehicle->reservationStatus = $reservation && $reservation->first() ? $reservation->first()->status : null;
            }
            // var_dump(  $vehicle->disponible);exit;
            // Récupérer le statut de la réservation, s'il y en a une

            // var_dump( $vehicle->reservationStatus);exit;
            return $vehicle;
        });

        $categories = Categorie::all();

        $serviceTypes = ServiceType::all();
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'latestVehicles' => $latestVehicles,
            'categories' => $categories,
            'scrollTo' => $request->input('scrollTo'),
            'serviceTypes' => $serviceTypes,
        ]);
    }

    private function jaccardSimilarity(array $a, array $b)
    {
        $intersection = count(array_intersect($a, $b));
        $union = count(array_merge($a, $b));

        return $union === 0 ? 0 : $intersection / $union;
    }


    public function all(Request $request)
    {
        $userId = Auth::id(); // Récupérer l'ID de l'utilisateur authentifié

        // Récupérer les paramètres de filtrage
        $search = $request->input('search', []);

        $date_depart = $search['date_depart'] ?? '';
        $date_retour = $search['date_retour'] ?? '';
        $categorie = $search['categorie'] ?? '';

        // Construire la requête pour les véhicules avec les relations 'categorie' et 'avis.user' en eager loading
        $query = Vehicule::with(['categorie', 'avis.user']);

        // Filtrage par marque ou modele
        if (isset($search["search"]) && $search["search"]) {
            // dd($search["search"]);
            $query->where(function ($q) use ($search) {
                $searchTerm = $search["search"]; // Extract the search term
                $q->where('marque', 'like', '%' . $searchTerm . '%')
                    ->orWhere('modele', 'like', '%' . $searchTerm . '%')
                    ->orWhere('immatriculation', 'like', '%' . $searchTerm . '%');
            });
        }


        // Filtrage par dates si fournies
        if ($date_depart && $date_retour) {
            $query->whereDoesntHave('reservations', function ($q) use ($date_depart, $date_retour) {
                $q->where(function ($query) use ($date_depart, $date_retour) {
                    $query->whereBetween('date_depart', [$date_depart, $date_retour])
                        ->orWhereBetween('date_retour', [$date_depart, $date_retour])
                        ->orWhere(function ($query) use ($date_depart, $date_retour) {
                            $query->where('date_depart', '<=', $date_depart)
                                ->where('date_retour', '>=', $date_retour);
                        });
                });
            });
        }

        // Filtrage par catégorie si fourni
        if ($categorie) {
            $query->where('categorie_id', $categorie);
        }



        $latestVehicles = $query->paginate(5);

        // dd($latestVehicles);
        $categories = Categorie::all();

        return Inertia::render('welcome/allCars', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'latestVehicles' => $latestVehicles,
            'categories' => $categories,
            'search' => $search, // Passer les filtres de recherche à la vue
        ]);
    }



    public function showServices()
    {
        $categories = ServiceType::all(); // Get all categories
        $services = Prestation::all(); // Get all services

        return Inertia::render('welcome/services', [
            'categories' => $categories,
            'services' => $services,
            'serviceTypes' => $categories,
        ]);
    }
}
