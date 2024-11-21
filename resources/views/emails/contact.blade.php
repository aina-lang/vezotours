<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Soumission du Formulaire de Contact</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
            text-align: center;
            color: #4CAF50;
        }

        p {
            font-size: 16px;
            line-height: 1.5;
            color: #333333;
        }

        .details {
            margin-top: 20px;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 5px;
        }

        .details p {
            margin: 8px 0;
        }

        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            color: #888888;
        }

        .email-link {
            display: inline-block;
            margin-top: 20px;
            text-decoration: none;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border-radius: 5px;
            font-weight: bold;
        }

        .email-link:hover {
            background-color: #45a049;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>Une Nouvelle Soumission du Formulaire de Contact</h1>
        <div class="details">
            <p><strong>Une personne vous a contacté avec les informations suivantes :</strong></p>
            <p><strong>Nom :</strong> {{ $details['nom'] }}</p>
            <p><strong>Email :</strong> {{ $details['email'] }}</p>
            <p><strong>Message :</strong> {{ $details['message'] }}</p>
        </div>

        <div class="footer">
            <p>Une personne vous a contacté via le formulaire de contact !</p>
            <p>Voici son message :</p>
            <a href="mailto: {{ $details['email'] }}"
                class="email-link">Répondre par Email</a>
        </div>
    </div>
</body>

</html>
