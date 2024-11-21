<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Session;

class UserAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string|array  $userTypes
     */
    public function handle(Request $request, Closure $next, $userTypes): Response
    {
        // Convertir les types d'utilisateur en tableau
        $userTypes = is_array($userTypes) ? $userTypes : explode('|', $userTypes);

        // Vérifier si l'utilisateur est authentifié et s'il a le type approprié
        if (Auth::check() && in_array(Auth::user()->type, $userTypes)) {
            return $next($request);
        }

        // dump(Auth::user()->type, $userTypes);
        
        // Ajouter une notification dans la session
        Session::flash('error', 'Vous n\'avez pas la permission d\'accéder à cette page.');

        // Rediriger vers la page précédente
        return redirect()->back();
    }
}
