<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Auth;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);
        $middleware->alias([
            'user-access' => \App\Http\Middleware\UserAccess::class,
        ]);

        $middleware->redirectUsersTo(function(){
            if (Auth::user()->type=="admin") {
               return "/admin/dashboard";
            }else{
                return "/admin/dashboard";
                // return "dashboard";
            }
        });
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
