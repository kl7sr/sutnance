<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>SEAAL - {{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    
    <style>
        :root {
            --SEAAL-primary: #003366;
            --SEAAL-primary-light: #004488;
            --SEAAL-green: #00A859;
        }
    </style>
</head>
<body class="font-sans text-gray-900 antialiased bg-gradient-to-br from-[#003366] to-[#004488] flex items-center justify-center min-h-screen">

    <div class="w-full max-w-md bg-white bg-opacity-95 backdrop-blur-md shadow-2xl rounded-3xl border border-white border-opacity-20 overflow-hidden text-center">
        
        <!-- Slot Content -->
        <div class="px-6 py-6">
            {{ $slot }}
        </div>

    </div>

</body>
</html>
