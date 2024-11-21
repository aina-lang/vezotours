<?php

// app/Http/Controllers/DashboardController.php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\User;
use App\Models\Vehicule;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    // public function index()
    // {
    //     // Fetch the data for the admin dashboard
    //     $totalCars = Vehicule::count();
    //     $totalReservations = Reservation::count();
    //     $totalUsers = User::where('type', '!=', 'admin')->count();

    //     // Calculate the total available cars
    //     $totalAvailableCars = $totalCars - $totalReservations;
    //     $rentedCarsPercentage = $totalCars > 0 ? round(($totalReservations / $totalCars) * 100, 2) : 0;
    //     $availableCarsPercentage = $totalCars > 0 ? round(($totalAvailableCars / $totalCars) * 100, 2) : 0;

    //     // Prepare chart data for Reservations per Month
    //     $reservationsPerMonth = Reservation::selectRaw("strftime('%m', created_at) as month, COUNT(*) as count")
    //         ->groupBy('month')
    //         ->orderBy('month')
    //         ->get();


    //     // Transform the data into a format suitable for the chart
    //     $monthlyData = [];
    //     for ($i = 1; $i <= 12; $i++) {
    //         $monthlyData[$i] = $reservationsPerMonth->firstWhere('month', $i)->count ?? 0;
    //     }

    //     // Get the top 3 most rented cars in the last three months
    //     $mostRentedCars = Reservation::select('vehicule_id', DB::raw('COUNT(*) as rental_count'))
    //         ->where('date_depart', '>=', now()->subMonths(3))
    //         ->where('status', 'confirmée')
    //         ->groupBy('vehicule_id')
    //         ->orderBy('rental_count', 'desc')
    //         ->take(3)
    //         ->with('vehicule') // Assuming 'vehicule' is the relationship in the Reservation model
    //         ->get()
    //         ->map(function ($reservation) {
    //             return [
    //                 'car' => $reservation->vehicule ?? null, // Adjust based on your vehicle model
    //                 'rental_count' => $reservation->rental_count,
    //             ];
    //         });

    //     // Get upcoming reservations
    //     $upcomingReservations = Reservation::with('user', 'vehicule') // Eager loading relationships
    //         ->where('date_depart', '>=', now())
    //         ->where('status', 'confirmée') // Only get confirmed reservations
    //         ->orderBy('date_depart')
    //         ->paginate(5);

    //     // Prepare data for the dashboard
    //     $dashboardData = [
    //         'totalCars' => $totalCars,
    //         'totalReservations' => $totalReservations,
    //         'totalUsers' => $totalUsers,
    //         'rentedCarsPercentage' => $rentedCarsPercentage,
    //         'availableCarsPercentage' => $availableCarsPercentage,
    //         'monthlyData' => array_values($monthlyData),
    //         'mostRentedCars' => $mostRentedCars,
    //         'upcomingReservations' => $upcomingReservations, // Include upcoming reservations
    //     ];

    //     if (Auth::user()->type == "user") {
    //         return Inertia::render('client/Dashboard', $dashboardData);
    //     } elseif (Auth::user()->type == "admin") {
    //         return Inertia::render('admin/Dashboard', $dashboardData);
    //     }
    // }

    public function index()
    {
        // Total des voitures
        $totalCars = Vehicule::count();

        // Total des réservations confirmées
        $totalConfirmedReservations = Reservation::where('status', 'confirmée')->count();

        // Total des voitures louées actuellement (confirmées et dont la date de départ n'est pas encore passée)
        $totalRentedCars = Reservation::where('status', 'confirmée')
            ->where('date_depart', '>=', now())
            ->distinct()
            ->count('vehicule_id');

        // Voitures disponibles : Non réservées ou réservées mais dont la date de départ est passée
        $totalAvailableCars = Vehicule::whereDoesntHave('reservations', function ($query) {
            $query->where('status', 'confirmée')
                ->where('date_depart', '>=', now());
        })->count();

        // Autres calculs (inchangés)
        $totalReservations = Reservation::count();
        $totalUsers = User::where('type', '!=', 'admin')->count();
        $totalPendingReservations = Reservation::where('status', 'en attente')->count();
        $totalCancelledReservations = Reservation::where('status', 'annulée')->count();

        // Répartition des réservations par mois
        $reservationsPerMonth = Reservation::selectRaw('strftime("%m", created_at) as month, COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Préparer les données mensuelles pour le graphique
        $monthlyData = [];
        for ($i = 1; $i <= 12; $i++) {
            $monthlyData[$i] = $reservationsPerMonth->firstWhere('month', str_pad($i, 2, '0', STR_PAD_LEFT))->count ?? 0;
        }

        // Réservations à venir
        $upcomingReservations = Reservation::with('user', 'vehicule')
            ->where('date_depart', '>=', now())
            ->where('status', 'confirmée')
            ->orderBy('date_depart')
            ->paginate(10);

        $nextReservation = $upcomingReservations->items()[0] ?? null;

        $currentDate = Carbon::now();

        // Filtrer les réservations dont la date de retour est déjà passée
        $totalArchives = Reservation::where('date_retour', '<', $currentDate)
            ->count();

        // Préparer les données du tableau de bord
        $dashboardData = [
            'totalCars' => $totalCars,
            'totalReservations' => $totalReservations,
            'totalUsers' => $totalUsers,
            'totalConfirmedReservations' => $totalConfirmedReservations,
            'totalPendingReservations' => $totalPendingReservations,
            'totalCancelledReservations' => $totalCancelledReservations,
            'totalRentedCars' => $totalRentedCars,
            'totalAvailableCars' => $totalAvailableCars,
            'monthlyData' => array_values($monthlyData),
            'upcomingReservations' => $upcomingReservations,
            'nextReservation' => $nextReservation,
            "totalArchives" => $totalArchives
        ];


        // dd($dashboardData);
        // Retourner les données du tableau de bord selon le type d'utilisateur
        if (Auth::user()->type == "user") {
            return Inertia::render('client/Dashboard', $dashboardData);
        } elseif (Auth::user()->type == "admin") {
            return Inertia::render('admin/Dashboard', $dashboardData);
        }
    }
}
