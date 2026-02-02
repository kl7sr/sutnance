<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>إضافة مستخدم جديد</title>
    
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet">
    
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: 'Tajawal', sans-serif; }
    </style>

    @viteReactRefresh
    @vite(['resources/js/front-end-react-app/src/user-create.jsx'])
</head>
<body class="bg-gray-100 antialiased">
    <div id="user-create-root" class="min-h-screen"></div>
</body>
</html>