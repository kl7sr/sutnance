<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">Modifier l'utilisateur</h2>
    </x-slot>

    <style>
        :root {
            --app-blue: #003366;
            --app-green: #00A859;
        }

        .main-blue-bg { background-color: var(--app-blue); }
        .main-green-bg { background-color: var(--app-green); }
        .main-blue-text { color: var(--app-blue); }
        .app-border { border-color: #E9ECEF; }
        .app-shadow { box-shadow: 0 4px 16px rgba(0, 51, 102, 0.12); }

        input[type="text"], input[type="email"], select {
            border: 2px solid var(--app-blue) !important;
        }
    </style>

    <div class="flex min-h-screen bg-gray-200">
        <x-sidebar />

        <div class="flex-1 bg-gray-200 p-8 pl-12">
            <div class="max-w-2xl">
                <div class="mb-8">
                    <h1 class="text-3xl font-bold main-text-blue">Modifier {{ $user->name }}</h1>
                </div>

                <div class="bg-white app-shadow rounded-2xl p-8 border-l-4 app-border-primary">
                    <form method="POST" action="{{ route('users.update', $user) }}" class="space-y-6" enctype="multipart/form-data">
                        @csrf
                        @method('PUT')

                        <div>
                            <label class="block text-sm font-semibold main-text-blue mb-2">Nom</label>
                            <input type="text" name="name" value="{{ old('name', $user->name) }}" required
                                   class="w-full border-2 app-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500/20 outline-none transition">
                        </div>

                        <div>
                            <label class="block text-sm font-semibold main-text-blue mb-2">Email</label>
                            <input type="email" name="email" value="{{ old('email', $user->email) }}" required
                                   class="w-full border-2 app-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500/20 outline-none transition">
                        </div>

                        <div>
                            <label class="block text-sm font-semibold main-text-blue mb-2">Rôle</label>
                            <select name="role" class="w-full border-2 app-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500/20 outline-none transition" required>
                                <option value="user" {{ old('role', $user->role) === 'user' ? 'selected' : '' }}>Utilisateur</option>
                                <option value="admin" {{ old('role', $user->role) === 'admin' ? 'selected' : '' }}>Administrateur</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-semibold main-text-blue mb-2">Photo de profil (optionnel)</label>
                            @if($user->profile_photo)
                                <div class="mb-2">
                                    <img src="{{ asset('storage/' . $user->profile_photo) }}" class="rounded-full object-cover shadow-lg border-4 border-[#003366]" alt="avatar" style="width: 128px; height: 128px; object-fit: cover;">
                                </div>
                            @endif
                            <input type="file" name="profile_photo" accept="image/*"
                                   class="w-full border-2 app-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/20 outline-none transition">
                        </div>

                        <div class="flex gap-4 pt-4">
                            <button type="submit" class="flex-1 px-8 py-3 main-blue-bg text-white rounded-lg hover:main-blue-bg-light transition font-semibold">Enregistrer</button>
                            <a href="{{ route('users.index') }}" class="flex-1 px-8 py-3 border-2 app-border text-gray-700 rounded-lg hover:bg-gray-100 transition font-semibold flex items-center justify-center">Annuler</a>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    </div>
</x-app-layout>
