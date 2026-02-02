<x-app-layout>
    <style>
        :root {
            --main-blue: #003366;
            --main-blue-light: #004488;
            --main-green: #00A859;
            --bg-light: #F8F9FA;
            --border-light: #E9ECEF;
            --text-muted: #6C757D;
        }
        
        .main-blue-bg { background-color: var(--main-blue); }
        .main-green-bg { background-color: var(--main-green); }
        .main-text-blue { color: var(--main-blue); }
        .gray-border { border-color: var(--border-light); }
        .app-shadow { box-shadow: 0 2px 8px rgba(0, 51, 102, 0.08); }
    </style>

    <div class="flex min-h-screen bg-gray-200">
        <x-sidebar />

        <div class="flex-1 bg-gray-200 p-8 pl-12">
            <div class="max-w-4xl">
                <!-- Header -->
                <div class="mb-8">
                    <div class="flex items-center gap-3 mb-2">
                        <svg class="w-6 h-6 main-text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 24px !important; height: 24px !important;">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                        </svg>
                        <h1 class="text-3xl font-bold main-text-blue">Annonces</h1>
                    </div>
                    <p class="text-gray-500 ml-10">Voir toutes les mises à jour et annonces récentes.</p>
                </div>

                {{-- Admin Form (Collapsible) --}}
                @if(auth()->user()->role === 'admin')
                <div class="mb-8 bg-white rounded-2xl shadow-xl border-l-4 border-[#00A859] overflow-hidden" x-data="{ open: false }">
                    <button @click="open = !open" class="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-[#00A859] flex items-center justify-center">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                                </svg>
                            </div>
                            <h2 class="text-xl font-bold main-text-blue">Créer une annonce</h2>
                        </div>
                        <svg class="w-6 h-6 text-gray-500 transition-transform" :class="{ 'rotate-180': open }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </button>
                    
                    <div x-show="open" x-collapse class="px-6 pb-6">
                        <form method="POST" action="{{ route('announcements.store') }}" class="space-y-5" enctype="multipart/form-data">
                            @csrf
                            <div>
                                <label class="block text-sm font-bold main-text-blue mb-2">Titre</label>
                                <input type="text" name="title" placeholder="Entrez le titre de l'annonce"
                                       class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none transition"
                                       style="border-color: #E5E7EB;"
                                       required>
                            </div>
                            <div>
                                <label class="block text-sm font-bold main-text-blue mb-2">Contenu</label>
                                <textarea name="content" placeholder="Entrez le contenu de l'annonce" rows="4"
                                          class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none transition resize-none"
                                          style="border-color: #E5E7EB;"
                                          required></textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-bold main-text-blue mb-2">Fichier joint (optionnel)</label>
                                <input type="file" name="attachment" accept="*/*" 
                                       class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#003366] hover:file:bg-blue-100">
                            </div>
                            <div class="flex justify-end pt-2">
                                <button type="submit"
                                        class="px-8 py-3 rounded-xl font-bold text-white shadow-lg transition transform active:scale-95 flex items-center gap-2"
                                        style="background-color: #00A859;">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                    </svg>
                                    Publier une annonce
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                @endif

                {{-- Announcements List --}}
                <div class="w-full">
                    <h3 class="text-xl font-bold main-text-blue mb-4 flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4a1 1 0 011-1h16a1 1 0 011 1v2.757a1 1 0 01-.414.757l-6.494 5.692a1 1 0 00-.172 1.393l6.294 8.945a1 1 0 01-.921 1.56H3a1 1 0 01-.921-1.56l6.294-8.945a1 1 0 00-.172-1.393L3.414 7.757A1 1 0 013 7V4z"/>
                        </svg>
                        Annonces récentes
                    </h3>
                    @if($announcements->count())
                        <div class="space-y-4">
                            @foreach($announcements as $a)
                                <div class="bg-white app-shadow rounded-xl p-6 hover:shadow-xl transition border-l-4 gray-border-green border-2 gray-border">
                                    <div class="flex items-start justify-between">
    <div class="flex-1">
        <h4 class="text-lg font-bold main-text-blue mb-2">{{ $a->title }}</h4>
        <p class="text-gray-700 mb-3">{{ $a->content }}</p>
        <div class="flex items-center gap-2 text-sm text-gray-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            {{ $a->created_at->format('d M Y à H:i') }}
        </div>
    </div>

    {{-- delet for only admin --}}
    @if(auth()->user()->role === 'admin')
    <div class="ml-4">
        <form action="{{ route('announcements.destroy', $a->id) }}" method="POST" onsubmit="return confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?');">
            @csrf
            @method('DELETE')
            <button type="submit" class="p-2 text-red-500 hover:bg-red-50 rounded-full transition duration-200" title="Supprimer l'annonce">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </form>
    </div>
    @endif
</div>
                                        <div class="flex-1">
                                            <h4 class="text-lg font-bold main-text-blue mb-2">{{ $a->title }}</h4>
                                            <p class="text-gray-700 mb-3">{{ $a->content }}</p>
                                            <div class="flex items-center gap-2 text-sm text-gray-500">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                </svg>
                                                {{ $a->created_at->format('d M Y à H:i') }}
                                            </div>
                                            @if($a->attachment)
                                                <div class="mt-3">
                                                    <a href="{{ route('announcements.download', $a) }}" class="inline-flex items-center gap-2 px-3 py-2 rounded-md" style="background-color:#00A859 !important; color:#ffffff !important;">
                                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v13m0 0l-4-4m4 4l4-4M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                                                        </svg>
                                                        Télécharger la pièce jointe
                                                    </a>
                                                </div>
                                            @endif
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    @else
                        <div class="bg-white app-shadow rounded-xl p-8 text-center">
                            <svg class="w-10 h-10 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            <p class="text-gray-500">Aucune annonce pour le moment.</p>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
