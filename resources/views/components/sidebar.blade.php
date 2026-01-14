<div class="w-64 text-white flex flex-col min-h-screen sidebar" style="background-color: #003366;">
    <style>
        :root{
            --green-accent:#00A859;
            --main-dark:#003366;
        }
        /* left accent bar */
        .sidebar .nav-list li a{position:relative;display:flex;align-items:center;padding-left:0.75rem !important}
        .sidebar .nav-list li a::before{content:'';position:absolute;left:0;top:8px;bottom:8px;width:4px;background:rgba(255,255,255,0.18);border-radius:6px;transition:background .15s ease}
        .sidebar .nav-list li a.bg-\[#002244\]::before{background:var(--green-accent)}

        /* top dividers between items */
        .sidebar .nav-list li{border-top:1px solid rgba(255,255,255,0.06);transition:border-color .15s ease}
        .sidebar .nav-list li:first-child{border-top:0}
        .sidebar .nav-list li:hover{border-top-color:rgba(255,255,255,0.06)}
    </style>
    <div class="p-4 flex-1">
        <!-- Logo/Header (stacked) -->
        <div class="flex flex-col items-center gap-2 mb-6 text-center">
            <img src="https://www.areal-topkapi.com/sites/default/files/2020-09/logo-seaal.jpg" alt="SEAAL Logo" class="w-9 h-9 object-cover">
            <div>
                <h3 class="text-2xl font-bold">Workspace</h3>
            </div>
        </div>
        
        <!-- Navigation -->
        <ul class="nav-list">
            <li>
                <a href="/dashboard" 
                   class="flex items-center gap-3 px-4 py-4 rounded-lg hover:bg-[#002244] {{ request()->is('dashboard') ? 'bg-[#002244]' : '' }}">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                    </svg>
                    <span class="text-lg">Tableau de bord</span>
                </a>
            </li>
            <li>
                <a href="/chat" 
                   class="flex items-center gap-3 px-4 py-4 rounded-lg hover:bg-[#002244] {{ request()->is('chat') ? 'bg-[#002244]' : '' }}">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                    <span class="text-lg">Chat d'équipe</span>
                </a>
            </li>
            <li>
                <a href="/announcements" 
                   class="flex items-center gap-3 px-4 py-4 rounded-lg hover:bg-[#002244] {{ request()->is('announcements') ? 'bg-[#002244]' : '' }}">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4a1 1 0 011-1h16a1 1 0 011 1v2.757a1 1 0 01-.414.757l-6.494 5.692a1 1 0 00-.172 1.393l6.294 8.945a1 1 0 01-.921 1.56H3a1 1 0 01-.921-1.56l6.294-8.945a1 1 0 00-.172-1.393L3.414 7.757A1 1 0 013 7V4z"/>
                    </svg>
                    <span class="text-lg">Annonces</span>
                </a>
            </li>
            
            @if(auth()->check() && auth()->user()->role === 'admin')
                <li>
                    <a href="{{ route('users.index') }}" 
                       class="flex items-center gap-3 px-4 py-4 rounded-lg hover:bg-[#002244] {{ request()->is('users') ? 'bg-[#002244]' : '' }}">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM9 19c-4.3 0-8-1.343-8-3s3.7-3 8-3 8 1.343 8 3-3.7 3-8 3z"/>
                        </svg>
                        <span class="text-lg">Gérer les utilisateurs</span>
                    </a>
                </li>
            @endif
            <li>
                <a href="{{ route('profile.show') }}" 
                   class="flex items-center gap-3 px-4 py-4 rounded-lg hover:bg-[#002244] {{ request()->is('profile') ? 'bg-[#002244]' : '' }}">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    <span class="text-lg">Profil</span>
                </a>
            </li>
        </ul>

        <!-- Admin Panel add button removed: add user is on users page -->
    </div>

    <!-- Logout Button - Pinned to Bottom -->
    <div class="p-4 border-t border-[#004488]">
        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit" class="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                <span>Déconnexion</span>
            </button>
        </form>
    </div>
</div>
