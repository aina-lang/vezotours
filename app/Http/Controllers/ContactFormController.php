<?php

namespace App\Http\Controllers;

use App\Mail\ContactMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactFormController extends Controller
{
    public function submit(Request $request)
    {
        $nom = $request->input("nom");
        $email = $request->input("email");
        $message = $request->input("message");

        try {
            Mail::to(User::where("type", 1)->first())->send(new ContactMail(['nom' => $nom, 'email' => $email, 'message' => $message]));
            return back()->with('success', 'Merci de nous avoir contactés.');
        } catch (\Exception $e) {
            return back()->with('error', 'Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer plus tard.');
        }
    }
}
