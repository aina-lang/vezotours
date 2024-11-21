<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {

        try {
            $request->authenticate();

            $request->session()->regenerate();
            // var_dump(Auth::user()->type);
            // exit;
            if (Auth::user()->type == "admin") {
                Session::flash('success', 'Authentification avec succès !');
                return redirect()->intended(route('admin.dashboard', absolute: false));
            }

            Session::flash('success', 'Authentification avec succès !');
            return redirect()->intended(route('home', absolute: false));
        } catch (\Exception $e) {
            Session::flash('error', 'Une erreur s\'est produite lors de l\'authentification de votre compte. <br>' . htmlspecialchars($e->getMessage()));
            return redirect()->back()->withInput();
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
