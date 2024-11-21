<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use App\Models\Reservation;
use App\Models\Vehicule;
use App\Traits\BulkAction;

use Illuminate\Contracts\Support\MessageProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

use Illuminate\Support\ViewErrorBag;
use Inertia\Inertia;

class VehiculeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    use BulkAction;

    public function create()
    {
        // Récupération des catégories depuis la base de données
        $categories = Categorie::all();

        // Renvoye à la vue avec les catégories
        return Inertia::render('admin/vehicules/add', [
            'categories' => $categories
        ]);
    }



    private function jaccardSimilarity($setA, $setB)
    {
        $intersection = count(array_intersect($setA, $setB));
        $union = count(array_unique(array_merge($setA, $setB)));

        return $union > 0 ? $intersection / $union : 0;
    }

    public function index(Request $request)
    {
        // Retrieve all categories for the dropdown filter
        $categories = Categorie::all();

        // Start the query with the relation to 'categorie'
        $query = Vehicule::with(['categorie', 'avis.user']);

        // Check if there are search parameters
        if ($request->filled('search') || $request->filled('categorie') || $request->filled('date_depart') || $request->filled('date_retour')) {

            // Filter by marque or modele with Jaccard similarity
            if ($request->filled('search')) {
                // Ensure the search term is split and in lowercase
                $searchTerms = explode(' ', strtolower($request->search));

                // Use a whereHas to filter by marque or modele
                $query->where(function ($q) use ($searchTerms) {
                    $q->whereHas('categorie', function ($query) use ($searchTerms) {
                        foreach ($searchTerms as $term) {
                            // Searching for each term in marque or modele using LIKE
                            $query->where('marque', 'like', '%' . $term . '%')
                                ->orWhere('modele', 'like', '%' . $term . '%');
                        }
                    });
                });
            }

            // Filter by category
            if ($request->filled('categorie')) {
                $query->where('categorie_id', $request->categorie);
            }

            // Filter by date range for availability
            if ($request->filled('date_depart') || $request->filled('date_retour')) {
                $query->whereDoesntHave('reservations', function ($q) use ($request) {
                    $q->where(function ($query) use ($request) {
                        // Filter for vehicles not available if both dates are provided
                        if ($request->filled('date_depart') && $request->filled('date_retour')) {
                            $query->whereBetween('date_depart', [$request->date_depart, $request->date_retour])
                                ->orWhereBetween('date_retour', [$request->date_depart, $request->date_retour])
                                ->orWhere(function ($query) use ($request) {
                                    $query->where('date_depart', '<=', $request->date_depart)
                                        ->where('date_retour', '>=', $request->date_retour);
                                });
                        }

                        // Filter for vehicles not available if only `date_depart` is provided
                        if ($request->filled('date_depart') && !$request->filled('date_retour')) {
                            $query->where('date_depart', '<=', $request->date_depart)
                                ->where('date_retour', '>=', $request->date_depart);
                        }

                        // Filter for vehicles not available if only `date_retour` is provided
                        if ($request->filled('date_retour') && !$request->filled('date_depart')) {
                            $query->where('date_depart', '<=', $request->date_retour)
                                ->where('date_retour', '>=', $request->date_retour);
                        }
                    });
                });
            }

            // Paginate the filtered results
            $vehicles = $query->paginate(5);

            // Return based on user type
            if (Auth::user()->type == "admin") {
                return inertia('admin/vehicules/index', [
                    'vehicules' => $vehicles,
                    'categories' => $categories, // Include categories for the dropdown filter
                ]);
            }

            return inertia('welcome/allCars', [
                'latestVehicles' => $vehicles,
                'categories' => $categories, // Include categories for the dropdown filter
            ]);
        }

        // If no search parameters are provided, return all vehicles with pagination
        $vehicules = Vehicule::with('categorie')->paginate(5);

        return inertia('admin/vehicules/index', [
            'vehicules' => $vehicules,
            'categories' => $categories, // Include categories for the dropdown filter
        ]);
    }






    /**
     * Show the form for creating a new resource.
     */

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'marque' => 'required|string|max:255',
            'modele' => 'required|string|max:255',
            'immatriculation' => 'required|string|max:50|unique:vehicules',
            'categorie' => 'required|exists:categories,id',
            'kilometrage' => 'required|numeric',
            'description' => 'required|string|max:500',
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:30720',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        try {
            $imagePaths = [];
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('vehicules', 'public');
                    $imagePaths[] = $path;
                }
            }

            Vehicule::create([
                'marque' => $request->marque,
                'modele' => $request->modele,
                'immatriculation' => $request->immatriculation,
                'categorie_id' => $request->categorie,
                'kilometrage' => $request->kilometrage,
                'description' => $request->description,
                'images' => json_encode($imagePaths),
            ]);

            session()->flash('success', 'Véhicule ajouté avec succès.');
            return redirect()->back();
        } catch (\Exception $e) {
            session()->flash('error', 'Erreur lors de l\'ajout du véhicule : ' . $e->getMessage());
            return redirect()->back()->withInput();
        }
    }




    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Eager load the category with the vehicle
        $vehicule = Vehicule::with('categorie')->findOrFail($id);

        $vehicule->unavailableDates = Reservation::where("id", $vehicule->id)->get()->map(function ($reservation) {
            return [
                'start' => $reservation->date_depart,
                'end' => $reservation->date_retour,
            ];
        })->toArray();

        return Inertia::render('admin/vehicules/show', [
            'vehicule' => $vehicule,
        ]);
    }

    public function showAll(string $id)
    {
        // Eager load the category with the vehicle
        $vehicule = Vehicule::with(['categorie', "avis.user"])->findOrFail($id);
        // dd($vehicule);
        // Get the unavailable dates based on reservations with 'confirmed' status
        $vehicule->unavailableDates = Reservation::where('vehicule_id', $vehicule->id)
            ->where('status', 'confirmée') // Make sure to check for confirmed status
            ->get()
            ->map(function ($reservation) {
                return [
                    'start' => $reservation->date_depart,
                    'end' => $reservation->date_retour,
                ];
            })
            ->toArray();

        return Inertia::render('welcome/showCar', [
            'vehicule' => $vehicule,
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $vehicule = Vehicule::with('categorie')->findOrFail($id); // Récupérer le véhicule ou générer une erreur 404
        $categories = Categorie::all();


        return Inertia::render('admin/vehicules/edit', [
            'vehicule' => $vehicule,
            'categories' => $categories
        ]); // Renvoyer à la vue pour éditer
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $vehicule = Vehicule::findOrFail($id);

        // dd($request->all());
        // Validation des données
        $validator = Validator::make($request->all(), [
            'marque' => 'required|string|max:255',
            'modele' => 'required|string|max:255',
            'immatriculation' => 'required|string|max:50|unique:vehicules,immatriculation,' . $id,
            'categorie' => 'required|exists:categories,id',
            'kilometrage' => 'required|numeric',
            'description' => 'required|string|max:500',
            'new_images.*' => 'image|mimes:jpeg,png,jpg,gif|max:30720',
        ]);


        if ($validator->fails()) {
            // $value = null;
            // if ($validator instanceof MessageProvider) {
            //     $value = $validator->getMessageBag();
            // }




            // $errors = session()->get('errors', new ViewErrorBag);


            // if (! $errors instanceof ViewErrorBag) {
            //     $errors = new ViewErrorBag;
            // }
            // dd($value,$errors);
            // . $errors->put('default', $value)
            session()->flash('error', 'Vérifier les champs<br/>hanotazy ');

            return redirect()->back()->withErrors($validator)->withInput();
        }

        try {
            // Suppression des images sélectionnées
            $imagePaths = json_decode($vehicule->images, true) ?: [];
            if ($request->has('delete_images')) {
                foreach ($request->delete_images as $image) {
                    // Supprimer le fichier du stockage
                    Storage::disk('public')->delete($image);
                    // Retirer l'image du tableau
                    $imagePaths = array_diff($imagePaths, [$image]);
                }
            }

            // Gestion du stockage des nouvelles images
            if ($request->hasFile('new_images')) {
                foreach ($request->file('new_images') as $image) {
                    $path = $image->store('vehicules', 'public');
                    $imagePaths[] = $path;
                }
            }

            // Mise à jour des données du véhicule
            $vehicule->update([
                'marque' => $request->marque,
                'modele' => $request->modele,
                'immatriculation' => $request->immatriculation,
                'categorie_id' => $request->categorie,
                'kilometrage' => $request->kilometrage,
                'description' => $request->description,
                'images' => json_encode(array_values($imagePaths)), // Stocker les chemins d'image au format JSON
            ]);

            session()->flash('success', 'Véhicule mis à jour avec succès.');
            return redirect()->route('admin.vehicules.index');
        } catch (\Exception $e) {
            session()->flash('error', 'Erreur lors de la mise à jour du véhicule : ' . $e->getMessage());
            return redirect()->back()->withInput();
        }
    }





    public function destroy(string $id)
    {
        $vehicule = Vehicule::findOrFail($id); // Récupérer le véhicule

        try {
            // Suppression des images de stockage
            $imagePaths = json_decode($vehicule->images, true);
            if ($imagePaths) {
                foreach ($imagePaths as $imagePath) {
                    Storage::disk('public')->delete($imagePath); // Supprimer les images du stockage
                }
            }

            // Suppression du véhicule
            $vehicule->delete();
            session()->flash('success', 'Véhicule supprimé avec succès.'); // Message de succès
            return redirect()->route('vehicules.index');
        } catch (\Exception $e) {
            session()->flash('error', 'Erreur lors de la suppression du véhicule : ' . $e->getMessage()); // Message d'erreur
            return redirect()->back();
        }
    }















    public function search(Request $request)
    {

        // var_dump($request->all());
        // exit;
        // Start the query with eager loading of categories

    }





    public function addImage(Request $request, $id)
    {
        // Validation de l'image
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:30720',
        ]);

        try {
            // Récupérer le véhicule
            $vehicule = Vehicule::findOrFail($id);

            // Déplacement de l'image vers le dossier de stockage
            $path = $request->file('image')->store('vehicules', 'public');

            // Ajouter l'image au tableau d'images
            $images = json_decode($vehicule->images, true) ?: []; // Récupérer les images existantes
            $images[] = $path; // Ajouter la nouvelle image
            $vehicule->images = json_encode($images); // Mettre à jour le champ images
            $vehicule->save(); // Enregistrer les modifications

            session()->flash('success', 'Image ajoutée avec succès.');
            return redirect()->back();
        } catch (\Exception $e) {
            session()->flash('error', 'Erreur lors de l\'ajout de l\'image : ' . $e->getMessage());
            return redirect()->back();
        }
    }

    public function removeImage(Request $request, $id)
    {
        // Validation de l'image à supprimer
        $request->validate([
            'image' => 'required|string',
        ]);

        try {
            // Récupérer le véhicule
            $vehicule = Vehicule::findOrFail($id);

            // Filtrer les images pour supprimer celle spécifiée
            $images = json_decode($vehicule->images, true);
            $imageToRemove = $request->image;
            $images = array_filter($images, fn($img) => $img !== $imageToRemove); // Retirer l'image

            // Mettre à jour le champ images
            $vehicule->images = json_encode($images);
            $vehicule->save(); // Enregistrer les modifications

            session()->flash('success', 'Image supprimée avec succès.');
            return redirect()->back();
        } catch (\Exception $e) {
            session()->flash('error', 'Erreur lors de la suppression de l\'image : ' . $e->getMessage());
            return redirect()->back();
        }
    }



    public function bulkDelete(Request $request)
    {

        // dd($request->all());
        return $this->bulkDeleteMany($request, Vehicule::class);
    }
}
