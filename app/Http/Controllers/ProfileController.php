<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        // Check if the user is authenticated
        if (Auth::check()) {
            // Check the user's type
            if (Auth::user()->type === 'admin') {
                // Render the admin profile edit page
                return Inertia::render('Profile/EditAdmin', [
                    'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
                    'status' => session('status'),
                ]);
            } else {
                // Render the regular user profile edit page
                return Inertia::render('Profile/EditClient', [
                    'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
                    'status' => session('status'),
                ]);
            }
        }

        // If the user is not authenticated, you can handle it accordingly, e.g., redirect to login
        return redirect()->route('login'); // Adjust the route as necessary
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {

        // var_dump($request->all());
        // exit;
        try {
            // Fill the user's data with validated input
            $request->user()->fill($request->validated());

            // Check if the email field has been updated and reset the verification timestamp
            if ($request->user()->isDirty('email')) {
                $request->user()->email_verified_at = null;
            }

            // Only update phone numbers if the user type is 'client'
            if ($request->user()->type === 'user') {

                // Ensure phones are decoded as an array
                $currentPhones = json_decode($request->user()->phones, true) ?? [];

                // Make sure $currentPhones is always an array
                if (!is_array($currentPhones)) {
                    $currentPhones = [];
                }

                // If there are phones to remove, filter them out
                if (isset($request->phones_remove) && is_array($request->phones_remove)) {
                    foreach ($request->phones_remove as $phoneToRemove) {
                        // Remove the phone number from current phones
                        $currentPhones = array_filter($currentPhones, function ($phone) use ($phoneToRemove) {
                            return $phone !== $phoneToRemove; // Keep only phones that are not being removed
                        });
                    }
                }

                // Ensure that new phones is an array before merging
                $newPhones = isset($request->phones) && is_array($request->phones) ? $request->phones : [];

                // Merge only unique new phones and avoid duplicates
                $currentPhones = array_unique(array_merge($currentPhones, $newPhones));
                
                // Store the updated phones back into the JSON column
                $request->user()->phones = json_encode(array_values($currentPhones));
            }

            // Save the user's information
            $request->user()->save();

            // var_dump($currentPhones);exit;
            // Set a success message in the session
            return redirect()->route('profile.edit')->with('success', 'Profil mis à jour avec succès.');
        } catch (\Exception $e) {
            // Handle any exceptions that occur during the update
            return redirect()->route('profile.edit')->withErrors(['update' => 'Une erreur est survenue lors de la mise à jour du profil. Veuillez réessayer.'])->withInput();
        }
    }




    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
