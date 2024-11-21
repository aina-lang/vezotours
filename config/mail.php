<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Mailer
    |--------------------------------------------------------------------------
    |
    | Cette option contrôle le mailer par défaut utilisé pour envoyer tous
    | les messages électroniques, sauf si un autre mailer est explicitement
    | spécifié lors de l'envoi du message. Tous les mailers supplémentaires
    | peuvent être configurés dans le tableau "mailers".
    |
    */

    'default' => env('MAIL_MAILER', 'smtp'),

    /*
    |--------------------------------------------------------------------------
    | Configurations des Mailers
    |--------------------------------------------------------------------------
    |
    | Ici, vous pouvez configurer tous les mailers utilisés par votre
    | application et leurs paramètres respectifs. Plusieurs exemples sont
    | configurés et vous pouvez en ajouter d'autres si nécessaire.
    |
    | Laravel prend en charge une variété de "transport" de mail, y compris :
    | "smtp", "sendmail", "mailgun", "ses", "postmark", "log", "array", etc.
    |
    */

    'mailers' => [

        'smtp' => [
            'transport' => 'smtp',
            'url' => env('MAIL_URL'),
            'host' => env('MAIL_HOST', 'smtp.gmail.com'),
            'port' => env('MAIL_PORT', 465),
            'encryption' => env('MAIL_ENCRYPTION', 'tls'),
            'username' => env('MAIL_USERNAME'),
            'password' => env('MAIL_PASSWORD'),
            'timeout' => null,
            'local_domain' => env('MAIL_EHLO_DOMAIN', parse_url(env('APP_URL', 'http://localhost'), PHP_URL_HOST)),
        ],

        'sendmail' => [
            'transport' => 'sendmail',
            'path' => env('MAIL_SENDMAIL_PATH', '/usr/sbin/sendmail -bs -i'),
        ],

        'log' => [
            'transport' => 'log',
            'channel' => env('MAIL_LOG_CHANNEL'),
        ],

        'array' => [
            'transport' => 'array',
        ],

        'failover' => [
            'transport' => 'failover',
            'mailers' => [
                'smtp',
                'log',
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Adresse "From" Globale
    |--------------------------------------------------------------------------
    |
    | Vous pouvez spécifier une adresse "from" globale pour tous les e-mails
    | envoyés par l'application.
    |
    */

    'from' => [
        'address' => env('MAIL_FROM_ADDRESS', 'noreply@gmail.com'),
        'name' => env('MAIL_FROM_NAME', 'VezoTours'),
    ],

];
