<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use App\Traits\BulkAction;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class CategorieController extends Controller
{
    use BulkAction;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Categorie::paginate(5); // Récupère toutes les catégories
        // dd($categories);
        return Inertia::render('admin/categories/index', [
            'categories' => $categories,
        ]); // Renvoyer à la vue avec les données
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/categories/add'); // Renvoyer à la vue pour créer une nouvelle catégorie
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validation des données
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255|unique:categories',
            'description' => 'nullable|string|max:500', // Validation pour la description
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput(); // Redirection avec erreurs de validation
        }

        try {
            // Création de la catégorie
            Categorie::create([
                'nom' => $request->nom,
                'description' => $request->description,
            ]);

            session()->flash('success', 'Catégorie ajoutée avec succès.'); // Message de succès
            return redirect()->back();
        } catch (\Exception $e) {
            session()->flash('error', 'Erreur lors de l\'ajout de la catégorie : ' . $e->getMessage()); // Message d'erreur
            return redirect()->back()->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $categorie = Categorie::findOrFail($id); // Récupérer la catégorie ou générer une erreur 404
        return Inertia::render('admin/categories/show', [
            'categorie' => $categorie,
        ]); // Renvoyer à la vue avec les données
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $categorie = Categorie::findOrFail($id); // Récupérer la catégorie ou générer une erreur 404
        return Inertia::render('admin/categories/edit', [
            'categorie' => $categorie,
        ]); // Renvoyer à la vue pour éditer
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $categorie = Categorie::findOrFail($id); // Récupérer la catégorie

        // Validation des données
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255|unique:categories,nom,' . $categorie->id,
            'description' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput(); // Redirection avec erreurs de validation
        }

        try {
            // Mise à jour de la catégorie
            $categorie->update([
                'nom' => $request->nom,
                'description' => $request->description,
            ]);

            session()->flash('success', 'Catégorie mise à jour avec succès.'); // Message de succès
            return redirect()->route('categories.index');
        } catch (\Exception $e) {
            session()->flash('error', 'Erreur lors de la mise à jour de la catégorie : ' . $e->getMessage()); // Message d'erreur
            return redirect()->back()->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $categorie = Categorie::findOrFail($id); // Récupérer la catégorie

        try {
            // Suppression de la catégorie
            $categorie->delete();
            session()->flash('success', 'Catégorie supprimée avec succès.'); // Message de succès
            return redirect()->route('categories.index');
        } catch (\Exception $e) {
            session()->flash('error', 'Erreur lors de la suppression de la catégorie : ' . $e->getMessage()); // Message d'erreur
            return redirect()->back();
        }
    }

    public function bulkDelete(Request $request)
    {

        // dd($request->all());
        return $this->bulkDeleteMany($request, Categorie::class);
    }
}
