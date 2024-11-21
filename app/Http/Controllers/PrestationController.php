<?php

namespace App\Http\Controllers;

use App\Models\Prestation;
use App\Models\ServiceType;
use App\Traits\BulkAction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class PrestationController extends Controller
{

    use BulkAction;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $prestations = Prestation::paginate(5); // Récupérer toutes les prestations paginées
        $categories = ServiceType::all();
        return Inertia::render('admin/prestations/index', [
            'prestations' => $prestations,
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $serviceTypes = ServiceType::all();

        return Inertia::render('admin/prestations/add', [
            'serviceTypes' => $serviceTypes,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validation des données
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255|unique:prestations',
            'description' => 'nullable|string|max:500',
            'service_type_id' => 'required|exists:service_types,id', // Validation pour s'assurer que le service type existe
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        try {
            // Création de la prestation avec le service_type_id
            Prestation::create([
                'nom' => $request->nom,
                'description' => $request->description,
                'service_type_id' => $request->service_type_id, // Ajout du type de service
            ]);

            session()->flash('success', 'Prestation ajoutée avec succès.');
            return redirect()->route('prestations.index');
        } catch (\Exception $e) {
            session()->flash('error', 'Erreur lors de l\'ajout de la prestation : ' . $e->getMessage());
            return redirect()->back()->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $prestation = Prestation::findOrFail($id); // Récupérer la prestation
        return Inertia::render('admin/prestations/show', [
            'prestation' => $prestation,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $serviceTypes = ServiceType::all();
        $prestation = Prestation::findOrFail($id); // Récupérer la prestation
        return Inertia::render('admin/prestations/edit', [
            'prestation' => $prestation,
            'serviceTypes' => $serviceTypes,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $prestation = Prestation::findOrFail($id); // Récupérer la prestation

        // Validation des données
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255|unique:prestations',
            'description' => 'nullable|string|max:500',
            'service_type_id' => 'required|exists:service_types,id', // Validation pour s'assurer que le service type existe
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        try {
            // Mise à jour de la prestation
            $prestation->update([
                'nom' => $request->nom,
                'description' => $request->description,
                'service_type_id' => $request->service_type_id, // Ajout du type de service
            ]);

            session()->flash('success', 'Prestation mise à jour avec succès.');
            return redirect()->route('prestations.index');
        } catch (\Exception $e) {
            session()->flash('error', 'Erreur lors de la mise à jour de la prestation : ' . $e->getMessage());
            return redirect()->back()->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $prestation = Prestation::findOrFail($id); // Récupérer la prestation

        try {
            // Suppression de la prestation
            $prestation->delete();
            session()->flash('success', 'Prestation supprimée avec succès.');
            return redirect()->route('prestations.index');
        } catch (\Exception $e) {
            session()->flash('error', 'Erreur lors de la suppression de la prestation : ' . $e->getMessage());
            return redirect()->back();
        }
    }

    public function bulkDelete(Request $request)
    {

        // dd($request->all());
        return $this->bulkDeleteMany($request, Prestation::class);
    }
}
