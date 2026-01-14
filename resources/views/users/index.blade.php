<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">{{ __('Gérer les utilisateurs') }}</h2>
    </x-slot>

    <div class="flex min-h-screen bg-gray-50">
        <x-sidebar />

        <div class="flex-1 p-8">
            <div class="max-w-4xl mx-auto">
                @if(session('success'))
                    <div class="mb-4 p-4 bg-green-100 text-green-800 rounded">{{ session('success') }}</div>
                @endif
                @if(session('error'))
                    <div class="mb-4 p-4 bg-red-100 text-red-800 rounded">{{ session('error') }}</div>
                @endif

                <div class="bg-white rounded-xl p-6 SEAAL-shadow">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-bold SEAAL-text-primary">Tous les utilisateurs</h3>
                        <a href="{{ route('users.create') }}" class="px-4 py-2 SEAAL-bg-green text-white rounded hover:SEAAL-bg-green-light">Ajouter un utilisateur</a>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-left">
                            <thead>
                                <tr class="text-sm text-gray-500 border-b">
                                    <th class="py-3">Nom</th>
                                    <th class="py-3">E-mail</th>
                                    <th class="py-3">Rôle</th>
                                    <th class="py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($users as $u)
                                    <tr class="border-b">
                                        <td class="py-3">{{ $u->name }}</td>
                                        <td class="py-3">{{ $u->email }}</td>
                                        <td class="py-3">{{ $u->role }}</td>
                                        <td class="py-3">
                                            @if(auth()->id() !== $u->id)
                                                <form method="POST" action="{{ route('users.destroy', $u) }}" onsubmit="return confirm('Supprimer cet utilisateur ?');" class="inline">
                                                    @csrf
                                                    @method('DELETE')
                                                    <button type="submit" class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Supprimer</button>
                                                </form>
                                            @else
                                                <span class="text-sm text-gray-500">(Vous)</span>
                                            @endif
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>