<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /**
     * Display the email verification prompt.
     */
    public function __invoke(Request $request): RedirectResponse|Response
    {
        if ($request->user()->hasVerifiedEmail()) {
            // Rediriger vers le tableau de bord admin ou l'accueil selon le type d'utilisateur
            return redirect()->intended(
                $request->user()->type == "admin"
                    ? route('admin.dashboard', absolute: false)
                    : route('home', absolute: false)
            );
        }

        // Afficher le prompt de vérification d'email
        return Inertia::render('Auth/VerifyEmail', ['status' => session('status')]);
    }
}
