<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Détails de la Réservation</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            /* Supprime les marges par défaut */
            padding: 20px;
            /* Supprime les espacements internes */

            background-color: #f9f9f9;
            color: #333;
        }

        @page {
            size: A4;
            margin: 0;
            /* Enlève les marges de la page pour l'impression */
        }

        h1 {
            text-align: center;
            color: #2c3e50;
            font-size: 2.5em;
            margin-bottom: 30px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top:50px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        
        th,
        td {
            padding: 18px;
            text-align: left;
            font-size: 1.1em;
        }

        th {
            background-color: #f2f2f2;
            color: #2c3e50;
            text-transform: uppercase;
        }

        td {
            border-bottom: 1px solid #ddd;
        }

        .highlight {
            font-weight: bold;
            color: #e74c3c;
        }

        .note {
            color: #7f8c8d;
            font-style: italic;
        }

        .footer {
            text-align: center;
            margin-top: 40px;
            font-size: 0.9em;
            color: #7f8c8d;
            position: absolute;
            bottom: 20px;
            left: 0;
            right: 0;
            margin: 40px auto 0;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 50px;
        }

        .header img {
            width: 100px;
            height: auto;
        }

        .header .agency-name {
            font-size: 1.5em;
            color: #2c3e50;
            font-weight: bold;
        }
    </style>
</head>

<?php
$dateDebut = new DateTime($reservation->date_depart);
$dateRetour = new DateTime($reservation->date_retour);

// Calcul de la différence
$interval = $dateDebut->diff($dateRetour);

// Nombre de jours
$nombreDeJours = $interval->days;
?>

<body>

    <div class="header">
        <!-- Logo à gauche -->
        <img src="chemin/vers/logo.png" alt="Logo de l'agence">

        <!-- Nom de l'agence à droite -->
        <div class="agency-name">{{ config('app.name', 'VezoTours') }}</div>
    </div>

    <h1 style="margin-bottom: 50px">Détails de votre Réservation</h1>

    <p style="text-align: center; font-size: 1.2em; color: #34495e;">Merci d'avoir choisi notre service. Voici un résumé
        complet des informations liées à votre réservation.</p>

    <table>
        <tr>
            <th>Nom du Client</th>
            <td>{{ $reservation->user->nom . ' ' . $reservation->user->prenoms }} </td>
        </tr>
        <tr>
            <th>Véhicule Réservé</th>
            <td>{{ $reservation->vehicule->marque }} - <span class="note">{{ $reservation->vehicule->modele }}</span>
            </td>
        </tr>
        <tr>
            <th>Date de Début de Location</th>
            <td>{{ $reservation->date_depart}} </td>
        </tr>
        <tr>
            <th>Date de Retour Prévue</th>
            <td>{{ $reservation->date_retour }} </td>
        </tr>
        <tr>
            <th>Durée de la Réservation (en jours)</th>
            <td class="highlight">{{ $nombreDeJours }} jours</td>
        </tr>
        <tr>
            <th>Statut de la Réservation</th>
            <td>
                @if ($reservation->status == 'confirmée')
                    <span style="color: green; font-weight: bold;">Confirmation réussie</span>
                @elseif ($reservation->status == 'en attente')
                    <span style="color: orange; font-weight: bold;">En attente de confirmation</span>
                @else
                    <span style="color: red; font-weight: bold;">Réservation annulée</span>
                @endif
            </td>
        </tr>
    </table>

    <div class="footer">
        <p>Pour toute question ou modification de votre réservation, veuillez nous contacter à <a
                href="mailto:support@exemple.com">support@exemple.com</a></p>
        <p>Merci de votre confiance, nous vous souhaitons une expérience agréable!</p>
    </div>

</body>

</html>
