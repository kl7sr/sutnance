<x-app-layout>
    <style>
        :root {
            --app-blue: #003366;
            --app-blue-light: #004488;
            --app-green: #00A859;
        }
        
        .main-blue-bg { background-color: var(--app-blue); }
        .main-green-bg { background-color: var(--app-green); }
        .main-text-blue { color: var(--app-blue); }
        .app-border { border-color: #E9ECEF; }
        .app-shadow { box-shadow: 0 4px 16px rgba(0, 51, 102, 0.12); }

        input[type="text"], input[type="email"], input[type="password"], select {
            border: 2px solid var(--app-blue) !important;
        }
    </style>

        <x-sidebar />
// Edit hicham 
<div class="flex min-h-screen bg-gray-200">
        <div class="flex-1 bg-gray-200 p-8 pl-12">
            <div class="max-w-2xl">
                <!-- Header -->
                <div class="mb-8">
                    <div class="flex items-center gap-3 mb-2">
                        <svg class="w-6 h-6 main-text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM9 19c-4.3 0-8-1.343-8-3s3.7-3 8-3 8 1.343 8 3-3.7 3-8 3z"/>
                        </svg>
                        <h1 class="text-3xl font-bold main-text-blue">Créer un utilisateur</h1>
                    </div>
                    <p class="text-gray-500">Ajouter un nouvel utilisateur au système.</p>
                </div>

                <!-- Create User Form -->
                <div class="bg-white app-shadow rounded-2xl p-8 border-l-4 app-border-primary">
                    <form method="POST" action="{{ route('users.store') }}" class="space-y-6" enctype="multipart/form-data">
                        @csrf

                        <!-- Name -->
                        <div>
                            <label class="block text-sm font-semibold main-text-blue mb-2">Nom</label>
                            <input type="text" name="name" value="{{ old('name') }}" placeholder="Entrez le nom de l'utilisateur"
                                   class="w-full border-2 app-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition @error('name') border-red-500 @enderror"
                                   required>
                            @error('name')
                                <p class="text-red-500 text-sm mt-2">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Email -->
                        <div>
                            <label class="block text-sm font-semibold main-text-blue mb-2">Email</label>
                            <input type="email" name="email" value="{{ old('email') }}" placeholder="Entrez l'email de l'utilisateur"
                                   class="w-full border-2 app-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition @error('email') border-red-500 @enderror"
                                   required>
                            @error('email')
                                <p class="text-red-500 text-sm mt-2">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Password -->
                        <div>
                            <label class="block text-sm font-semibold main-text-blue mb-2">Mot de passe</label>
                            <input type="password" name="password" placeholder="Entrez le mot de passe (minimum 8 caractères)"
                                   class="w-full border-2 app-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition @error('password') border-red-500 @enderror"
                                   required>
                            @error('password')
                                <p class="text-red-500 text-sm mt-2">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Confirm Password -->
                        <div>
                            <label class="block text-sm font-semibold main-text-blue mb-2">Confirmer le mot de passe</label>
                            <input type="password" name="password_confirmation" placeholder="Confirmez le mot de passe"
                                   class="w-full border-2 app-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition @error('password_confirmation') border-red-500 @enderror"
                                   required>
                            @error('password_confirmation')
                                <p class="text-red-500 text-sm mt-2">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Role -->
                        <div>
                            <label class="block text-sm font-semibold main-text-blue mb-2">Rôle</label>
                            <select name="role" class="w-full border-2 app-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition @error('role') border-red-500 @enderror"
                                    required>
                                <option value="">-- Sélectionnez un rôle --</option>
                                <option value="user" {{ old('role') === 'user' ? 'selected' : '' }}>Utilisateur</option>
                                <option value="admin" {{ old('role') === 'admin' ? 'selected' : '' }}>Administrateur</option>
                            </select>
                            @error('role')
                                <p class="text-red-500 text-sm mt-2">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Profile Photo -->
                        <div>
                            <label class="block text-sm font-semibold main-text-blue mb-2">Photo de profil (optionnel)</label>
                            <input type="file" name="profile_photo" accept="image/*"
                                   class="w-full border-2 app-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/20 outline-none transition @error('profile_photo') border-red-500 @enderror">
                            @error('profile_photo')
                                <p class="text-red-500 text-sm mt-2">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Submit Button -->
                        <div class="flex gap-4 pt-4">
                            <button type="submit"
                                    class="flex-1 px-8 py-3 text-white rounded-lg transition font-semibold flex items-center justify-center gap-2 shadow-lg"
                                    style="background-color: #00A859;">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                </svg>
                                Créer l'utilisateur
                            </button>
                            <a href="{{ route('dashboard') }}"
                               class="flex-1 px-8 py-3 border-2 app-border text-gray-700 rounded-lg hover:bg-gray-100 transition font-semibold flex items-center justify-center gap-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                                Annuler
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
