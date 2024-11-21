<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Vehicule;
use Barryvdh\DomPDF\Facade\Pdf;
use Dompdf\Options;

class PdfController extends Controller
{
    public function vehicule(Vehicule $vehicule)
    {

        // Charger la vue pour le PDF
        $pdf = Pdf::loadView('pdf.vehicule', compact('vehicule'));


        return $pdf->download($vehicule->modele . '.pdf');
    }



    public function reservation(Reservation   $reservation)
    {

        // Générer le PDF
        $pdf = PDF::loadView('pdf.reservation', compact('reservation'));

        // Retourner le PDF en tant que téléchargement
        return $pdf->download('reservation_' . $reservation->id . '.pdf');
    }
}
