<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>SEAAL - {{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Instrument Sans', sans-serif;
            background: linear-gradient(135deg, #003366 0%, #004488 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 16px;
        }

        .welcome-card {
            width: 100%;
            max-width: 400px;
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(12px);
            border-radius: 24px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.25);
            overflow: hidden;
            text-align: center;
            padding: 32px 24px;
        }

        .logo {
            width: 64px;
            height: 64px;
            border-radius: 12px;
            object-fit: cover;
            margin: 0 auto 16px auto;
        }

        .logo-text {
            font-size: 28px;
            font-weight: 600;
            color: #003366;
            margin-bottom: 8px;
        }

        .tagline {
            font-size: 14px;
            color: rgba(0, 51, 102, 0.7);
            margin-bottom: 16px;
        }

        .description {
            font-size: 16px;
            line-height: 1.6;
            color: #003366;
            margin-bottom: 24px;
        }

        .auth-buttons {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .auth-button {
            padding: 14px 28px;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
            text-align: center;
            width: 100%;
            border: 2px solid transparent;
            cursor: pointer;
            display: inline-block;
        }

        .login-btn {
            background-color: #003366;
            color: white;
            border-color: #003366;
        }

        .login-btn:hover {
            background-color: white;
            color: #003366;
        }

        .dashboard-btn {
            background-color: #00A859;
            color: white;
            border-color: #00A859;
        }

        .dashboard-btn:hover {
            background-color: #009249;
            border-color: #009249;
        }
    </style>
</head>
<body>
    <div class="welcome-card">
        <img src="https://www.areal-topkapi.com/sites/default/files/2020-09/logo-seaal.jpg" alt="SEAAL Logo" class="logo">
        <div class="logo-text">SEAAL</div>
        <div class="tagline">Alimenter le progrès</div>

        <div class="description">
            Bienvenue dans votre espace de travail collaboratif. Connectez-vous pour accéder au tableau de bord.
        </div>

        @if (Route::has('login'))
            <div class="auth-buttons">
                @auth
                    <a href="{{ url('/dashboard') }}" class="auth-button dashboard-btn">
                        Aller au Tableau de bord
                    </a>
                @else
                    <a href="{{ route('login') }}" class="auth-button login-btn">
                        Se connecter
                    </a>
                @endauth
            </div>
        @endif
    </div>
</body>
</html>
