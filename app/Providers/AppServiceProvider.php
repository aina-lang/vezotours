<?php

namespace App\Providers;

use Illuminate\Routing\UrlGenerator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Tighten\Ziggy\Ziggy;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(UrlGenerator $url): void
    {


        Schema::defaultStringLength(191);


        // $destinationPath = '/var/task/database/database.sqlite';  // Destination dans Vercel

        // // Vérifier si le fichier source existe et le fichier de destination n'existe pas
        // if (!File::exists($destinationPath)) {

        //     // Si le fichier source n'existe pas, créer un fichier SQLite vide à la destination
        //     File::put($destinationPath, '');
        //     File::put("database/database.sqlite", '');
        //     File::put("/tmp/database/database.sqlite", ''); // Créer un fichier vide
        //     echo "Le fichier SQLite a été créé avec succès!";
        // }

        if (env('APP_ENV') == 'production') {
            $url->forceScheme('https');
        }
        // dd(Auth::user());
        Vite::prefetch(concurrency: 3);

        Inertia::share([
            'auth' => [
                'user' => Auth::user(),
            ],
            'ziggy' => fn() => [
                ...(new Ziggy)->toArray(),
                'location' => Auth::url(),
            ],
            'flash' => [
                'success' => session()->get('success'),
                'error' => session()->get('error'),
                'warning' => session()->get('warning'),
            ]
        ]);
    }
}
