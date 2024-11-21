<?php

namespace App\Traits;

use Illuminate\Http\Request;

trait BulkAction
{
    /**
     * Suppression multiple avec gestion des erreurs et flash pour Inertia.
     *
     * @param Request $request
     * @param string $modelClass
     * @return \Illuminate\Http\RedirectResponse
     */
    public function bulkDeleteMany(Request $request, $modelClass)
    {
        $ids = $request->get("idsToDelete");


        // dd($ids);        // Validation de base
        if (!is_array($ids) || empty($ids)) {
            session()->flash('error', 'Aucun ID fourni ou format incorrect.');
            return redirect()->back();
        }

        try {
            // Suppression des enregistrements
            $deletedCount = $modelClass::whereIn('id', $ids)->delete();

            if ($deletedCount > 0) {
                session()->flash('success', "$deletedCount élément(s) supprimé(s) avec succès.");
            } else {
                session()->flash('warning', 'Aucun élément trouvé pour la suppression.');
            }
            return redirect()->back();
        } catch (\Exception $e) {
            session()->flash('error', 'Erreur lors de la suppression : ' . $e->getMessage());
            return redirect()->back();
        }
    }

    public function bulkApproveMany(Request $request, $modelClass)
    {
        $ids = $request->get("idsToDelete");


        // dd($ids);        // Validation de base
        if (!is_array($ids) || empty($ids)) {
            session()->flash('error', 'Aucun ID fourni ou format incorrect.');
            return redirect()->back();
        }

        try {
            // Suppression des enregistrements
            $deletedCount = $modelClass::whereIn('id', $ids)->delete();

            if ($deletedCount > 0) {
                session()->flash('success', "$deletedCount élément(s) supprimé(s) avec succès.");
            } else {
                session()->flash('warning', 'Aucun élément trouvé pour la suppression.');
            }
            return redirect()->back();
        } catch (\Exception $e) {
            session()->flash('error', 'Erreur lors de la suppression : ' . $e->getMessage());
            return redirect()->back();
        }
    }
}
