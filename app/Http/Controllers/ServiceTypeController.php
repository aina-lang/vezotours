<?php

namespace App\Http\Controllers;

use App\Models\ServiceType;
use App\Traits\BulkAction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class ServiceTypeController extends Controller
{
    use BulkAction;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $serviceTypes = ServiceType::paginate(5); // Récupérer tous les types de services paginés
        return Inertia::render('admin/serviceTypes/index', [
            'serviceTypes' => $serviceTypes,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/serviceTypes/add');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validation des données
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255|unique:service_types',
            'description' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        try {
            // Création du type de service
            ServiceType::create([
                'nom' => $request->nom,
                'description' => $request->description,
            ]);

            session()->flash('success', 'Type de service ajouté avec succès.');
            return redirect()->route('serviceTypes.index');
        } catch (\Exception $e) {
            session()->flash('error', 'Erreur lors de l\'ajout du type de service : ' . $e->getMessage());
            return redirect()->back()->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $serviceType = ServiceType::findOrFail($id); // Récupérer le type de service
        return Inertia::render('admin/serviceTypes/show', [
            'serviceType' => $serviceType,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $serviceType = ServiceType::findOrFail($id); // Récupérer le type de service
        return Inertia::render('admin/serviceTypes/edit', [
            'serviceType' => $serviceType,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $serviceType = ServiceType::findOrFail($id); // Récupérer le type de service

        // Validation des données
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255|unique:service_types,nom,' . $serviceType->id,
            'description' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        try {
            // Mise à jour du type de service
            $serviceType->update([
                'nom' => $request->nom,
                'description' => $request->description,
            ]);

            session()->flash('success', 'Type de service mis à jour avec succès.');
            return redirect()->route('serviceTypes.index');
        } catch (\Exception $e) {
            session()->flash('error', 'Erreur lors de la mise à jour du type de service : ' . $e->getMessage());
            return redirect()->back()->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $serviceType = ServiceType::findOrFail($id); // Récupérer le type de service

        try {
            // Suppression du type de service
            $serviceType->delete();
            session()->flash('success', 'Type de service supprimé avec succès.');
            return redirect()->route('serviceTypes.index');
        } catch (\Exception $e) {
            session()->flash('error', 'Erreur lors de la suppression du type de service : ' . $e->getMessage());
            return redirect()->back();
        }
    }


    public function bulkDelete(Request $request)
    {

        // dd($request->all());
        return $this->bulkDeleteMany($request, ServiceType::class);
    }
}
