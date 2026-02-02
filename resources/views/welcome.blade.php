<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>SEAAL - Welcome</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    <style>
        body {
            font-family: 'Instrument Sans', sans-serif;
            background: linear-gradient(135deg, #003366 0%, #004488 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 16px;
        }

        .welcome-card {
            width: 100%;
            max-width: 400px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(12px);
            border-radius: 24px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.25);
            text-align: center;
            padding: 40px 24px;
        }

        .logo { width: 80px; margin-bottom: 20px; border-radius: 12px; }
        .logo-text { font-size: 28px; font-weight: 600; color: #003366; margin-bottom: 8px; }
        .description { font-size: 16px; color: #003366; margin-bottom: 30px; line-height: 1.5; }
        
        .auth-button {
            display: block;
            padding: 14px;
            background-color: #003366;
            color: white;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            transition: 0.3s;
        }
        .auth-button:hover { background-color: #002244; transform: translateY(-2px); }
    </style>
</head>
<body>
    <div class="welcome-card">
        <img src="https://www.areal-topkapi.com/sites/default/files/2020-09/logo-seaal.jpg" alt="SEAAL Logo" class="logo">
        <div class="logo-text">SEAAL</div>
        <div class="description">
            Bienvenue dans votre espace de travail collaboratif. <br>
            Veuillez vous connecter pour continuer.
        </div>

        @if (Route::has('login'))
            @auth
                <a href="{{ url('/dashboard') }}" class="auth-button">Aller au Tableau de bord</a>
            @else
                <a href="{{ route('login') }}" class="auth-button">Se connecter</a>
            @endauth
        @endif
    </div>
</body>
</html>