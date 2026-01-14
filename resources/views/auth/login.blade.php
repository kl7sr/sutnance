<x-guest-layout>
    <style>
        :root {
            --app-blue: #003366;
            --app-blue-light: #004488;
            --app-green: #00A859;
            --bg-light: #F8F9FA;
        }
        .card-bg { background-color: var(--bg-light); }
        .btn-primary { background-color: var(--app-blue); color: #fff; }
        .btn-primary:hover { background-color: var(--app-blue-light); }
    </style>

    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#003366] to-[#004488] px-4">
        <div class="w-full sm:max-w-sm bg-white bg-opacity-95 backdrop-blur-md shadow-2xl rounded-3xl border border-white border-opacity-20 overflow-hidden text-center">
            
            <div class="px-6 py-6">
                <div class="text-center mb-4">
                    <img src="https://www.areal-topkapi.com/sites/default/files/2020-09/logo-seaal.jpg" 
                         alt="SEAAL Logo" class="w-16 h-16 rounded-md object-cover mx-auto mb-3">
                    <h2 class="text-2xl font-extrabold text-gray-800">Connexion</h2>
                    <p class="mt-1 text-sm text-gray-600">Entrez vos identifiants pour continuer</p>
                </div>

                <!-- Session Status -->
                <x-auth-session-status class="mb-4" :status="session('status')" />

                <form method="POST" action="{{ route('login') }}" class="space-y-4">
                    @csrf

                    <!-- Email Address -->
                    <div>
                        <x-input-label for="email" :value="__('E-mail')" />
                        <x-text-input id="email" class="block mt-1 w-full rounded-md border-gray-300 shadow-sm" 
                                      type="email" name="email" :value="old('email')" required autofocus autocomplete="username" />
                        <x-input-error :messages="$errors->get('email')" class="mt-2" />
                    </div>

                    <!-- Password -->
                    <div>
                        <x-input-label for="password" :value="__('Mot de passe')" />
                        <x-text-input id="password" class="block mt-1 w-full rounded-md border-gray-300 shadow-sm"
                                      type="password" name="password" required autocomplete="current-password" />
                        <x-input-error :messages="$errors->get('password')" class="mt-2" />
                    </div>

                    <div class="flex items-center justify-between">
                        <label for="remember_me" class="inline-flex items-center">
                            <input id="remember_me" type="checkbox" class="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500" name="remember">
                            <span class="ms-2 text-sm text-gray-600">{{ __('Se souvenir de moi') }}</span>
                        </label>

                        @if (Route::has('password.request'))
                            <a class="text-sm text-gray-600 hover:text-gray-800" href="{{ route('password.request') }}">
                                {{ __('Mot de passe oublié?') }}
                            </a>
                        @endif
                    </div>

                    <div>
                        <button type="submit" class="w-full btn-primary py-2 rounded-lg transition font-semibold">
                            {{ __('Connexion') }}
                        </button>
                    </div>
                </form>
            </div>

        </div>
    </div>
</x-guest-layout>
