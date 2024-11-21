<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Traits\BulkAction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class ClientController extends Controller
{

    use BulkAction;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $clients = User::where("type", 0)->paginate(5); // Retrieve all clients
        return Inertia::render('admin/clients/index', [
            'clients' => $clients,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/clients/add'); // Render the form for creating a new client
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'nom' => 'required|string|max:255',
                'prenoms' => 'nullable|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
                'phones.*' => 'string|max:15',
                // 'status' => 'required|string|in:active,inactive,pending',
            ]);

            // Create the new client
            User::create([
                'nom' => $validatedData['nom'],
                'prenoms' => $validatedData['prenoms'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'phones' => json_encode($request->phones),
                // 'status' => $validatedData['status'],
                'type' => 0, // Assuming 'type' is used to distinguish client types
            ]);

            return redirect()->back()->with('success', 'Client ajouté avec succès.');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput(); // Handle validation errors
        } catch (\Exception $e) {
            dd($e->getMessage());
            return back()->with('error', 'Erreur lors de l\'ajout du client.')->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $client = User::findOrFail($id); // Fetch the client by ID or fail
        return Inertia::render('admin/clients/show', [
            'client' => $client,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $client = User::findOrFail($id); // Fetch the client by ID or fail
        return Inertia::render('admin/clients/edit', [
            'client' => $client,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $validatedData = $request->validate([
                'nom' => 'required|string|max:255',
                'prenoms' => 'nullable|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . $id,
                'password' => 'nullable|string|min:8',
                'phones' => 'nullable|array', // Ensure phones is an array
                'phones.*' => 'string|max:15', // Each phone number must be a string
                'phones_remove' => 'nullable|array', // Ensure phones_remove is an array
                'phones_remove.*' => 'string|max:15', // Each phone number to remove must be a string
            ]);

            // Find the client
            $client = User::findOrFail($id);

            // Hash the password if provided
            if (!empty($validatedData['password'])) {
                $validatedData['password'] = Hash::make($validatedData['password']);
            } else {
                // If no new password is provided, remove the password field to avoid updating it
                unset($validatedData['password']);
            }

            // Prepare data for update, excluding phones_remove
            $updateData = $validatedData;
            unset($updateData['phones_remove']); // Remove phones_remove from the data to be updated

            // Update the client with the validated data except for phones
            $client->update($updateData);

            // Retrieve the current phones from the JSON column
            $currentPhones = json_decode($client->phones, true) ?? [];

            // If there are phones to remove, filter them out
            if (isset($validatedData['phones_remove']) && is_array($validatedData['phones_remove'])) {
                foreach ($validatedData['phones_remove'] as $phoneToRemove) {
                    // Remove the phone number from current phones
                    $currentPhones = array_filter($currentPhones, function ($phone) use ($phoneToRemove) {
                        return $phone !== $phoneToRemove; // Keep only phones that are not being removed
                    });
                }
            }

            // Merge new phones with existing ones, avoiding duplicates
            if (isset($validatedData['phones']) && is_array($validatedData['phones'])) {
                // Merge only unique new phones and avoid duplicates
                $currentPhones = array_unique(array_merge($currentPhones, $validatedData['phones']));
            }

            // Store the updated phones back into the JSON column
            $client->phones = json_encode(array_values($currentPhones)); // Use array_values to reindex the array
            $client->save(); // Save the updated phones to the database

            return redirect()->back()->with('success', 'Client mis à jour avec succès.');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput(); // Handle validation errors
        } catch (\Exception $e) {
            dd($e->getMessage());
            return back()->with('error', 'Erreur lors de la mise à jour du client.')->withInput();
        }
    }




    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $client = User::findOrFail($id); // Fetch the client by ID or fail
            $client->delete();

            return redirect()->back()->with('success', 'Client supprimé avec succès.');
        } catch (\Exception $e) {
            dd($e->getMessage());
            return back()->with('error', 'Erreur lors de la suppression du client.');
        }
    }

    public function bulkDelete(Request $request)
    {

        // dd($request->all());
        return $this->bulkDeleteMany($request, User::class);
    }
}
