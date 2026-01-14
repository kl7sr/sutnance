<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">User List</h2>
    </x-slot>

    <style>
        :root {
            --app-blue: #003366;
            --app-green: #00A859;
        }
        
        .main-blue-bg { background-color: var(--app-blue); }
        .main-green-bg { background-color: var(--app-green); }
        .main-text-blue { color: var(--app-blue); }
        .app-shadow { box-shadow: 0 2px 8px rgba(0, 51, 102, 0.08); }
    </style>

    <div class="flex min-h-screen bg-gray-200">
        <x-sidebar />

        <div class="flex-1 bg-gray-200 p-8 pl-12">
            <div class="max-w-5xl">
                @if(session('success'))
                    <div class="mb-4 p-4 bg-green-100 text-green-800 rounded">{{ session('success') }}</div>
                @endif
                @if(session('error'))
                    <div class="mb-4 p-4 bg-red-100 text-red-800 rounded">{{ session('error') }}</div>
                @endif

                <div class="w-full">
                    <div class="bg-white rounded-xl p-6 app-shadow">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-bold main-text-blue">Tous les utilisateurs</h3>
                            @if(auth()->user() && auth()->user()->role === 'admin')
                                <a href="{{ route('users.create') }}" class="px-4 py-2 main-green-bg text-white rounded hover:main-green-bg-light">Ajouter un utilisateur</a>
                            @endif
                        </div>

                        <div class="overflow-x-auto">
                            <table class="w-full text-left">
                                <thead>
                                    <tr class="text-sm text-gray-500 border-b">
                                        <th class="py-3">Avatar</th>
                                        <th class="py-3">Nom</th>
                                        <th class="py-3">E-mail</th>
                                        <th class="py-3">Rôle</th>
                                        <th class="py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach($users as $u)
                                        <tr class="border-b">
                                            <td class="py-3">
                                                @if($u->profile_photo)
                                                    <img src="{{ asset('storage/' . $u->profile_photo) }}" class="rounded-full object-cover" alt="avatar" style="width:40px;height:40px;object-fit:cover;border-radius:9999px;">
                                                @else
                                                    <div class="rounded-full text-white flex items-center justify-center text-sm font-bold border-2 border-white" style="width:40px;height:40px;background-color:#00A859;">{{ substr($u->name, 0, 1) }}</div>
                                                @endif
                                            </td>
                                            <td class="py-3">{{ $u->name }}</td>
                                            <td class="py-3">{{ $u->email }}</td>
                                            <td class="py-3">{{ $u->role }}</td>
                                            <td class="py-3">
                                                @if(auth()->user() && auth()->user()->role === 'admin')
                                                    <div class="flex items-center gap-2">
                                                        <a href="{{ route('users.edit', $u) }}" class="inline-block px-3 py-1 main-blue-bg text-white rounded hover:main-blue-bg-light">Modifier</a>
                                                        @if(auth()->id() !== $u->id)
                                                            <form method="POST" action="{{ route('users.destroy', $u) }}" onsubmit="return confirm('Supprimer cet utilisateur ?');" class="inline">
                                                                @csrf
                                                                @method('DELETE')
                                                                <button type="submit" class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Supprimer</button>
                                                            </form>
                                                        @else
                                                            <span class="text-sm text-gray-500">(Vous)</span>
                                                        @endif
                                                    </div>
                                                @else
                                                    @if(auth()->id() === $u->id)
                                                        <span class="text-sm text-gray-500">(Vous)</span>
                                                    @endif
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

    </div>
</x-app-layout>