<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        // Si l'email est déjà vérifié
        if ($request->user()->hasVerifiedEmail()) {
            if (Auth::user()->type == "admin") {
                Session::flash('success', 'Authentification avec succès !');
                return redirect()->intended(route('admin.dashboard', absolute: false));
            }
            Session::flash('success', 'Authentification avec succès !');
            return redirect()->intended(route('home', absolute: false));
        }

        // Marque l'email comme vérifié
        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));
        }

        // Redirection basée sur le type d'utilisateur
        if (Auth::user()->type == "admin") {
            Session::flash('success', 'Authentification avec succès !');
            return redirect()->intended(route('admin.dashboard', absolute: false));
        }

        // Redirection pour les utilisateurs normaux
        Session::flash('success', 'Authentification avec succès !');
        return redirect()->intended(route('home', absolute: false));
    }
}
