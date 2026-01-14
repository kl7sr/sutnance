<x-app-layout>
    <style>
        :root {
            --app-blue: #003366;
        }
    </style>

    <div class="flex h-screen bg-gray-50 overflow-hidden">
        
        <x-sidebar />

        <div class="flex-1 flex flex-col items-center justify-center p-8 bg-gray-200">
            
            <!-- Profile Card (Messenger Style) -->
            <div class="bg-white w-96 flex flex-col items-center py-10 px-6 rounded-3xl shadow-2xl shadow-blue-900/20" 
                 style="border: 4px solid #003366 !important; border-radius: 40px !important;">
                
                <!-- Avatar -->
                <div class="mb-4 relative">
                    @if($user->profile_photo)
                        <img src="{{ asset('storage/' . $user->profile_photo) }}" 
                             class="object-cover rounded-full shadow-lg transition"
                             style="width: 128px !important; height: 128px !important; border: 4px solid #003366;">
                    @else
                        <div class="w-32 h-32 rounded-full flex items-center justify-center text-5xl font-bold text-white shadow-lg"
                             style="background-color: #00A859; border: 4px solid #FFFFFF;">
                            {{ substr($user->name, 0, 1) }}
                        </div>
                    @endif
                </div>

                <!-- Name -->
                <h1 class="text-3xl font-bold text-[#003366] mb-1">{{ $user->name }}</h1>
                <p class="text-gray-500 font-medium mb-8">Employé SEAAL</p>

                <!-- Circle Actions Row -->
                <div class="flex items-center justify-between w-full px-8 mb-10">
                    
                    <!-- Send Message Action -->
                    @if(auth()->id() !== $user->id)
                    <a href="{{ route('chat.dm', $user) }}" class="flex flex-col items-center gap-2 group">
                        <div class="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-md transition transform group-hover:-translate-y-1"
                             style="background-color: #003366;">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                            </svg>
                        </div>
                        <span class="text-sm font-bold text-[#003366]">Message</span>
                    </a>
                    @endif

                    <!-- Stats -->
                    <div class="flex flex-col items-center gap-2 group">
                        <div class="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-[#003366] shadow-md border-2 border-[#003366]">
                            <span class="font-bold text-xl">{{ $user->conversations()->count() }}</span>
                        </div>
                        <span class="text-sm font-bold text-[#003366]">Discussions</span>
                    </div>

                </div>

                <!-- Info List -->
                <div class="w-full space-y-3">
                    
                    <div class="w-full pb-2 mb-2" style="border-bottom: 2px solid #003366;">
                        <h3 class="font-bold text-[#003366] text-lg">Informations</h3>
                    </div>
                    
                    <div class="w-full bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                        <!-- Email -->
                        <div class="w-full flex items-center gap-4 p-4 border-b border-gray-200">
                            <div class="p-2 rounded-full bg-blue-100 text-[#003366]">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                            </div>
                            <div class="flex-1">
                                <p class="text-xs text-gray-500 uppercase font-bold tracking-wider">Email Professionnel</p>
                                <p class="text-gray-900 font-semibold">{{ $user->email }}</p>
                            </div>
                        </div>

                        <!-- Member Since -->
                        <div class="w-full flex items-center gap-4 p-4">
                            <div class="p-2 rounded-full bg-blue-100 text-[#003366]">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            </div>
                            <div class="flex-1">
                                <p class="text-xs text-gray-500 uppercase font-bold tracking-wider">Membre Depuis</p>
                                <p class="text-gray-900 font-semibold">{{ $user->created_at->format('d M Y') }}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </div>
</x-app-layout>
