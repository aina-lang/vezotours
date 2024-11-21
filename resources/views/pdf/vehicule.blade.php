<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Détails du Véhicule</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa; /* Light background color */
            color: #343a40; /* Dark text color */
        }
        h1 {
            text-align: center;
            margin-top: 20px;
            color: #007bff; /* Primary color for the title */
        }
        .container {
            max-width: 800px; /* Max width for better readability */
            margin: 0 auto; /* Centering the container */
            padding: 20px;
            background-color: #ffffff; /* White background for the details */
            border-radius: 8px; /* Rounded corners */
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
        }
        .vehicule-image {
            width: 100%; /* Full width for the image */
            height: auto; /* Maintain aspect ratio */
            border-radius: 8px; /* Rounded corners for the image */
        }
        .vehicule-details {
            margin-top: 20px;
        }
        .vehicule-details p {
            margin: 10px 0; /* Space between paragraphs */
            font-size: 18px; /* Slightly larger text */
        }
        .vehicule-details strong {
            color: #007bff; /* Color for the labels */
        }
    </style>
</head>
<body>
    <h1>Détails du Véhicule</h1>
    <div class="container">
        <img class="vehicule-image" src="{{ $vehicule->images[0] }}" alt="{{ $vehicule->marque }} {{ $vehicule->modele }}">
        <div class="vehicule-details">
            <p><strong>Marque:</strong> {{ $vehicule->marque }}</p>
            <p><strong>Modèle:</strong> {{ $vehicule->modele }}</p>
            <p><strong>Immatriculation:</strong> {{ $vehicule->immatriculation }}</p>
            <p><strong>Kilométrage:</strong> {{ $vehicule->kilometrage }} km</p>
            <p><strong>Prix Journalier:</strong> {{ $vehicule->prix_journalier }} €</p>
            <p><strong>Description:</strong> {{ $vehicule->description }}</p>
        </div>
    </div>
</body>
</html>
