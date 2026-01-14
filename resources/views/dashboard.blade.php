<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Annonces') }}
        </h2>
    </x-slot>

    <style>
        :root {
            --app-blue: #003366;
            --app-blue-dark: #002244;
            --app-green: #00A859;
            --bg-gray: #F8F9FA;
            --border-gray: #E9ECEF;
            --text-gray: #6C757D;
        }
        
        .main-blue-bg { background-color: var(--app-blue); }
        .main-green-bg { background-color: var(--app-green); }
        .main-text-blue { color: var(--app-blue); }
        .app-border { border-color: var(--border-gray); }
        .app-shadow { box-shadow: 0 4px 16px rgba(0, 51, 102, 0.12); }

        input[type="text"], input[type="email"], input[type="password"], textarea, select {
            border: 2px solid var(--app-blue) !important;
        }
    </style>

    <div class="flex min-h-screen bg-gray-200">
        <x-sidebar />

        <div class="flex-1 bg-gray-200 p-8 pl-12">
            <div class="max-w-5xl">                
                <!-- Announcements List -->
                <div class="w-full">
                    <h3 class="text-xl font-bold main-text-blue mb-4 flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4a1 1 0 011-1h16a1 1 0 011 1v2.757a1 1 0 01-.414.757l-6.494 5.692a1 1 0 00-.172 1.393l6.294 8.945a1 1 0 01-.921 1.56H3a1 1 0 01-.921-1.56l6.294-8.945a1 1 0 00-.172-1.393L3.414 7.757A1 1 0 013 7V4z"/>
                        </svg>
                        Annonces récentes
                    </h3>
                    @php
                        $announcements = \App\Models\Announcement::latest()->get();
                    @endphp
                    @if($announcements->count())
                        <div class="space-y-4">
                            @foreach($announcements as $a)
                                <div class="bg-white app-shadow rounded-xl p-6 hover:shadow-xl transition border-l-4 app-border-green border-2 app-border">
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
                                            @if($a->attachment)
                                                <div class="mt-3">
                                                    <a href="{{ route('announcements.download', $a) }}" class="inline-flex items-center gap-2 px-3 py-2 rounded-md" style="background-color:#00A859 !important; color:#ffffff !important;">
                                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v13m0 0l-4-4m4 4l4-4M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                                                        </svg>
                                                        Télécharger
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