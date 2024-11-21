<?php

// app/Http/Controllers/AvisController.php

namespace App\Http\Controllers;

use App\Models\Avis;
use App\Models\Vehicule;
use App\Traits\BulkAction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Exception;

class AvisController extends Controller
{

    use BulkAction;

    // Ajouter un nouvel avis
    public function store(Request $request, $vehiculeId)
    {
        try {
            $request->validate([
                'note' => 'required|integer|between:1,5',
                'commentaire' => 'required|string|max:1000',
            ]);


            if (!Avis::userHasReviewForVehicle(Auth::id(), $vehiculeId)) {
                $vehicule = Vehicule::findOrFail($vehiculeId);
                Avis::create([
                    'vehicule_id' => $vehicule->id,
                    'user_id' => Auth::id(),
                    'note' => $request->note,
                    'commentaire' => $request->commentaire,
                ]);
                // Rediriger vers la page du véhicule avec un message de succès
                return redirect()->back()->with('success', 'Avis ajouté avec succès');
            }

            // Rediriger vers la page du véhicule avec un message de succès
            return redirect()->back()->with('error', 'Vous avez le droit qu\'un seul avis pour un véhicule');
        } catch (Exception $e) {
            // Gérer l'exception et renvoyer un message d'erreur via Inertia
            return Inertia::render('Avis/Create', [
                'error' => 'Une erreur est survenue lors de l\'ajout de l\'avis. Veuillez réessayer.',
                'vehiculeId' => $vehiculeId,
            ]);
        }
    }

    public function bulkDelete(Request $request)
    {

        // dd($request->all());
        return $this->bulkDeleteMany($request, Avis::class);
    }
}
