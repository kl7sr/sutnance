<x-app-layout>
    <style>
        :root {
            --app-blue: #003366;
            --app-blue-light: #1E4F91;
            --app-green: #00A859;
            --app-gray: #F1F5F9;
            --border-color: #E5E7EB;
            --text-gray: #6B7280;
        }

        .main-blue-bg { background-color: var(--app-blue); }
        .main-green-bg { background-color: var(--app-green); }
        .main-blue-text { color: var(--app-blue); }
        .app-border { border-color: var(--border-color); }
        
        .active-chat {
            background-color: #E0F2FE;
            border-left: 4px solid var(--app-blue);
        }
        
        [x-cloak] { display: none !important; }
        
        /* sizes for images */
        .avatar-small { width: 32px !important; height: 32px !important; object-fit: cover; border-radius: 50%; }
        .avatar-sidebar { width: 40px !important; height: 40px !important; object-fit: cover; border-radius: 50%; }
        .avatar-large { width: 80px !important; height: 80px !important; object-fit: cover; border-radius: 50%; }
        
        /* Chat images styling */
        .chat-image {
            max-width: 300px;
            max-height: 400px;
            border-radius: 12px;
            object-fit: cover;
            cursor: pointer;
            transition: transform 0.2s;
        }
        
        .chat-image:hover {
            transform: scale(1.02);
        }
        
        .chat-image-container {
            margin-top: 8px;
            display: inline-block;
        }
    </style>

    <div class="flex h-screen bg-gray-200 overflow-hidden">
         
        <x-sidebar />

        <div class="flex-1 flex overflow-hidden m-6 gap-6">
            
            <div class="w-80 bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col overflow-hidden">
                <div class="p-6 border-b border-gray-100 bg-white flex justify-between items-center">
                    <h2 class="font-bold text-xl main-blue-text">Discussions</h2>
                    @if(auth()->user()->role === 'admin')
                        <button onclick="openGroupModal()" class="text-white p-2 rounded-xl shadow-lg hover:shadow-xl transition transform active:scale-95 flex-shrink-0" style="background-color: #003366;" title="Nouveau groupe">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                            </svg>
                        </button>
                    @endif
                </div>

                <div class="flex-1 overflow-y-auto p-2">
                    @foreach($conversations as $c)
                        @php
                            $isActive = isset($conversation) && $conversation->id === $c->id;
                            // get the other person
                            $otherUser = $c->users->where('id', '!=', auth()->id())->first();
                            $displayName = $c->type === 'group' ? $c->name : ($otherUser ? $otherUser->name : 'Utilisateur Inconnu');
                            $photo = $c->type === 'group' ? $c->image : ($otherUser ? $otherUser->profile_photo : null);
                        @endphp

                        <a href="{{ route('chat.index', $c) }}" 
                           class="block p-4 transition-all duration-200 {{ $isActive ? 'bg-blue-50 border-l-4 border-l-[#003366]' : 'hover:bg-gray-50' }}"
                           style="border-bottom: 1px solid #E5E7EB;">
                            <div class="flex items-center gap-3">
                                <div class="relative">
                                    @if($photo)
                                        <img src="{{ storageUrl($photo) }}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;" class="border-2 border-white shadow-sm">
                                    @else
                                        <div style="width: 48px; height: 48px; border-radius: 50%;" class="{{ $c->type === 'group' ? 'main-green-bg' : 'main-blue-bg' }} text-white flex items-center justify-center font-bold text-lg shadow-sm">
                                            {{ substr($displayName, 0, 1) }}
                                        </div>
                                    @endif
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h4 class="text-sm font-bold text-gray-900 truncate">{{ $displayName }}</h4>
                                    <p class="text-xs text-gray-500 truncate font-medium">
                                        {{ $c->type === 'group' ? 'Groupe' : 'Message direct' }}
                                    </p>
                                </div>
                            </div>
                        </a>
                    @endforeach
                </div>
            </div>

            <div class="flex-1 bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col overflow-hidden relative">
                
                @if(auth()->user()->role === 'admin')
                <div id="group-modal" class="hidden absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 rounded-r-2xl">
                    <div class="bg-white shadow-2xl w-full max-w-sm p-6 relative transform transition-transform duration-300 scale-95" 
                         style="border: 4px solid #003366 !important; border-radius: 24px !important;"
                         id="group-content">
                        
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-xl font-bold main-blue-text">Nouveau Groupe</h2>
                            <button onclick="closeGroupModal()" class="text-gray-400 hover:text-gray-600 font-bold">✕</button>
                        </div>

                        <form action="{{ route('chat.create_group') }}" method="POST" enctype="multipart/form-data">
                            @csrf
                            
                            <!-- Group Name -->
                            <div class="mb-4">
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Nom du groupe</label>
                                <input type="text" name="name" required class="w-full px-4 py-2 border rounded-xl focus:ring-[#003366] focus:border-[#003366]" placeholder="Ex: Projet X">
                            </div>

                            <!-- Group Image -->
                            <div class="mb-4">
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Choisir une photo</label>
                                <input type="file" name="image" accept="image/*" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#003366] hover:file:bg-blue-100">
                            </div>

                            <!-- Participants -->
                            <div class="mb-6">
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Participants</label>
                                <div style="max-height: 250px; overflow-y: auto; border: 2px solid #E5E7EB; border-radius: 0.75rem; padding: 0.5rem;" class="space-y-1 custom-scrollbar">
                                    @foreach($allUsers as $u)
                                        <label class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition">
                                            <input type="checkbox" name="participants[]" value="{{ $u->id }}" class="w-4 h-4 text-[#003366] rounded focus:ring-[#003366] border-gray-300">
                                            <div class="flex items-center gap-2">
                                                @if($u->profile_photo)
                                                    <img src="{{ storageUrl($u->profile_photo) }}" class="rounded-full object-cover" style="width: 32px !important; height: 32px !important;">
                                                @else
                                                    <div class="rounded-full text-white flex items-center justify-center text-xs font-bold border-2 border-white" style="width: 32px !important; height: 32px !important; background-color: #00A859;">{{ substr($u->name, 0, 1) }}</div>
                                                @endif
                                                <span class="text-gray-900 font-medium text-sm">{{ $u->name }}</span>
                                            </div>
                                        </label>
                                    @endforeach
                                </div>
                            </div>

                            <div class="flex justify-end gap-3">
                                <button type="button" onclick="closeGroupModal()" class="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-lg transition font-medium text-sm">Annuler</button>
                                <button type="submit" class="px-6 py-2 text-white font-bold rounded-lg shadow-md transition transform active:scale-95 text-sm" style="background-color: #003366;">
                                    Créer le groupe
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                @endif
                @if(isset($conversation))
                    <!-- CHAT HEADER -->
                    <div class="p-4 border-b border-green-600 shadow-sm flex items-center justify-between rounded-tr-2xl relative" style="background-color: #00A859 !important;">
                        <div class="flex items-center gap-3">
                            <h2 class="text-xl font-bold text-white">
                                {{ $conversation->type === 'group' ? $conversation->name : ($conversation->users->where('id', '!=', auth()->id())->first()->name ?? 'Utilisateur Inconnu') }}
                            </h2>
                        </div>
                        <!-- Info Button -->
                        <button onclick="toggleInfoSidebar()" class="text-white hover:bg-white/20 transition p-2 rounded-full">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </button>
                    </div>

                    <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-[#F8F9FA]" id="chat-scroller">
                        @foreach($messages as $msg)
                            @php $isMe = $msg->user_id === auth()->id(); @endphp
                            <div class="flex {{ $isMe ? 'justify-end' : 'justify-start' }}">
                                <div class="max-w-[70%]">
                                    @if(!$isMe)
                                        <button onclick='openProfile(event, @json($msg->user))' 
                                                class="text-xs text-gray-500 ml-2 mb-1 block hover:underline hover:text-[#003366] font-semibold text-left">
                                            {{ $msg->user->name }}
                                        </button>
                                    @endif
                                    
                                    <div class="flex gap-2 {{ $isMe ? 'flex-row-reverse' : '' }}">
                                        <!-- Avatar beside message -->
                                        @if(!$isMe)
                                            <button onclick='openProfile(event, @json($msg->user))' class="flex-shrink-0">
                                                @if($msg->user->profile_photo)
                                                    <img src="{{ storageUrl($msg->user->profile_photo) }}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" class="border border-gray-200">
                                                @else
                                                    <div style="width: 32px; height: 32px; border-radius: 50%; background-color: #00A859;" class="flex items-center justify-center text-xs font-bold text-white border-2 border-white">
                                                        {{ substr($msg->user->name, 0, 1) }}
                                                    </div>
                                                @endif
                                            </button>
                                        @endif

                                        <div class="px-4 py-3 rounded-2xl shadow-sm 
                                            {{ $isMe ? 'bg-[#E6F0FF] border border-blue-100 rounded-br-none' : 'bg-white border border-gray-200 rounded-bl-none' }}">
                                            
                                            <p class="text-sm text-gray-900 leading-relaxed">{{ $msg->content }}</p>

                                            @if($msg->attachment)
                                                @php
                                                    $isImage = in_array(strtolower(pathinfo($msg->attachment, PATHINFO_EXTENSION)), ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']);
                                                @endphp
                                                <div class="mt-2 pt-2 border-t border-gray-200/50">
                                                    @if($isImage)
                                                        <div class="chat-image-container">
                                                            <a href="{{ storageUrl($msg->attachment) }}" target="_blank" rel="noopener noreferrer">
                                                                <img src="{{ storageUrl($msg->attachment) }}" alt="Image partagée" class="chat-image">
                                                            </a>
                                                        </div>
                                                    @else
                                                        <a href="{{ route('chat.download', $msg) }}" class="inline-flex items-center gap-2 text-xs font-medium main-blue-text hover:underline">
                                                            📎 Pièce jointe
                                                        </a>
                                                    @endif
                                                </div>
                                            @endif
                                        </div>
                                    </div>
                                    <span class="text-[10px] text-gray-400 mt-1 block {{ $isMe ? 'text-right mr-2' : 'ml-12' }}">
                                        {{ $msg->created_at->format('H:i') }}
                                    </span>
                                </div>
                            </div>
                        @endforeach
                    </div>

                    <div class="p-4 bg-white border-t app-border rounded-br-2xl">
                        <form id="chat-form" action="{{ route('chat.send', $conversation) }}" method="POST" enctype="multipart/form-data" class="flex items-center gap-3" onsubmit="return validateMessage()">
                            @csrf
                            
                            <!-- Hidden file inputs -->
                            <input type="file" id="attachment-doc" name="attachment" class="hidden" accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.odt,.rtf" onchange="handleFileSelected(this)">
                            <input type="file" id="attachment-photo" name="attachment" class="hidden" accept="image/*" onchange="handleFileSelected(this)">
                            
                            <!-- Attachment Button -->
                            <button type="button" onclick="openAttachmentModal()" class="cursor-pointer p-3 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 hover:text-[#003366] transition flex-shrink-0" title="Joindre un fichier" id="attach-btn">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
                            </button>

                            <!-- Input -->
                            <div class="flex-1 relative">
                                <input type="text" id="msg-input" name="content" placeholder="Écrivez votre message..." 
                                       class="w-full px-5 py-3 rounded-full border-gray-300 focus:border-[#003366] focus:ring focus:ring-[#003366]/20 transition shadow-sm bg-gray-50">
                            </div>

                            <!-- Send Button -->
                            <button type="submit" class="bg-[#003366] hover:bg-[#002244] text-white p-3 rounded-full shadow-lg transition transform active:scale-95 flex-shrink-0">
                                <svg class="w-5 h-5 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                            </button>
                        </form>
                    </div>



                    <!-- ATTACHMENT TYPE MODAL (Positioned near attachment button) -->
                    <div id="attachment-modal" class="hidden absolute z-50 transition-opacity duration-300" style="bottom: 80px; left: 20px;">
                        <div class="bg-white shadow-2xl w-64 p-4 relative transform transition-transform duration-300 scale-95" 
                             style="border: 4px solid #003366 !important; border-radius: 16px !important;"
                             id="attachment-content">
                            
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="font-bold" style="font-size: 0.875rem; color: #1F2937;">Choisir le type</h3>
                                <button onclick="closeAttachmentModal()" class="font-bold" style="color: #9CA3AF; font-size: 1.125rem;">✕</button>
                            </div>

                            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                <button onclick="selectAttachmentType('photo')" class="w-full font-semibold transition flex items-center justify-center shadow-md" style="padding: 0.75rem; background-color: #00A859 !important; color: #ffffff !important; border-radius: 0.5rem; gap: 0.5rem; font-size: 0.875rem;">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                    Photo
                                </button>
                                
                                <button onclick="selectAttachmentType('document')" class="w-full font-semibold transition flex items-center justify-center shadow-md" style="padding: 0.75rem; background-color: #003366 !important; color: #ffffff !important; border-radius: 0.5rem; gap: 0.5rem; font-size: 0.875rem;">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                    Document
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- INFO MODAL (Centered within chat section) -->
                    <div id="info-sidebar" class="hidden absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" style="border-radius: 0 16px 16px 0;">
                        <div class="bg-white shadow-2xl w-full max-w-xs overflow-y-auto relative" 
                             style="border: 4px solid #003366; border-radius: 24px; max-height: 80%;">
                        <div class="p-6">
                            <div class="flex justify-between items-center mb-6 pb-4" style="border-bottom: 2px solid #003366;">
                                <h3 class="text-lg font-bold text-[#003366]">Détails</h3>
                                <button onclick="toggleInfoSidebar()" class="text-gray-400 hover:text-red-500 font-bold text-xl transition">✕</button>
                            </div>

                            @if($conversation->type === 'group')
                                <!-- GROUP INFO -->
                                
                                <div class="flex flex-col items-center mb-6 pb-6" style="border-bottom: 1px solid #E5E7EB;">
                                    @if($conversation->image)
                                        <img src="{{ storageUrl($conversation->image) }}" class="rounded-full object-cover border-4 border-[#003366] mb-4" style="width: 80px; height: 80px;">
                                    @else
                                        <div class="rounded-full text-white flex items-center justify-center text-2xl font-bold mb-4 border-4 border-white" style="width: 80px; height: 80px; background-color: #00A859;">
                                            {{ substr($conversation->name, 0, 1) }}
                                        </div>
                                    @endif
                                    
                                    @if(auth()->user()->role === 'admin')
                                        <form action="{{ route('chat.update_group', $conversation) }}" method="POST" enctype="multipart/form-data" class="w-full text-center">
                                            @csrf
                                            @method('PUT')
                                            <input type="text" name="name" value="{{ $conversation->name }}" 
                                                   class="w-full text-center font-bold text-xl text-gray-900 mb-3 border-none focus:ring-0 outline-none">
                                            <label class="inline-block px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 cursor-pointer hover:border-[#003366] transition">
                                                Changer la photo
                                                <input type="file" name="image" class="hidden" accept="image/*" onchange="this.form.submit()">
                                            </label>
                                        </form>
                                    @else
                                        <h4 class="font-bold text-xl text-gray-900">{{ $conversation->name }}</h4>
                                    @endif
                                </div>

                                <div class="mb-6 pb-6" style="border-bottom: 1px solid #E5E7EB;">
                                    <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Membres ({{ $conversation->users->count() }})</h4>
                                    <div class="max-h-32 overflow-y-auto custom-scrollbar">
                                        @foreach($conversation->users as $u)
                                            <a href="{{ route('users.show', $u) }}" class="flex items-center gap-3 hover:bg-gray-50 transition group py-3 px-2" style="border-bottom: 1px solid #F3F4F6;">
                                                @if($u->profile_photo)
                                                    <img src="{{ storageUrl($u->profile_photo) }}" class="rounded-full object-cover" style="width: 32px !important; height: 32px !important;">
                                                @else
                                                    <div class="rounded-full text-white flex items-center justify-center text-xs font-bold border-2 border-white" style="width: 32px !important; height: 32px !important; background-color: #00A859;">{{ substr($u->name, 0, 1) }}</div>
                                                @endif
                                                <div class="flex-1 flex items-center justify-between">
                                                    <span class="text-sm font-medium text-gray-900 group-hover:text-[#003366]">{{ $u->name }}</span>
                                                    @if($u->role === 'admin')
                                                        <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Admin</span>
                                                    @endif
                                                </div>
                                            </a>
                                        @endforeach
                                    </div>
                                </div>

                                <div class="mt-auto">
                                    @if(auth()->user()->role === 'admin')
                                        <form action="{{ route('chat.destroy', $conversation) }}" method="POST" onsubmit="return confirm('Supprimer ce groupe ? Cette action est irréversible.');">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="w-full py-3 text-red-600 hover:bg-red-50 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                                Supprimer le groupe
                                            </button>
                                        </form>
                                    @endif
                                </div>

                            @else
                                <!-- PRIVATE CHAT INFO -->
                                @php $u = $conversation->users->where('id', '!=', auth()->id())->first(); @endphp
                                @if($u)
                                    <div class="flex flex-col items-center mb-6">
                                        @if($u->profile_photo)
                                            <img src="{{ storageUrl($u->profile_photo) }}" class="rounded-full object-cover border-4 border-white shadow mb-3" style="width: 80px; height: 80px;">
                                        @else
                                            <div class="rounded-full text-white flex items-center justify-center text-2xl font-bold mb-3 shadow border-4 border-white" style="width: 80px; height: 80px; background-color: #00A859;">
                                                {{ substr($u->name, 0, 1) }}
                                            </div>
                                        @endif
                                        <h4 class="font-bold text-xl text-gray-900">{{ $u->name }}</h4>
                                        <p class="text-gray-500 text-sm">{{ $u->email }}</p>
                                    </div>

                                    <div class="space-y-3">
                                        <a href="{{ route('users.show', $u) }}" class="block w-full py-2 text-center bg-[#003366] text-white rounded-lg hover:bg-[#002244] font-semibold transition">
                                            Voir le profil
                                        </a>
                                        
                                        <form action="{{ route('chat.destroy', $conversation) }}" method="POST" onsubmit="return confirm('Supprimer la discussion ?');">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="block w-full py-2 text-center bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-semibold transition">
                                                Supprimer la discussion
                                            </button>
                                        </form>
                                    </div>
                                @endif
                            @endif
                        </div>
                        </div>
                    </div>
                @else
                    <div class="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 rounded-r-2xl">
                        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">💬</div>
                        <h3 class="text-xl font-semibold text-gray-600 mb-2">Vos messages</h3>
                        <p class="text-center max-w-sm">Sélectionnez une conversation à gauche.</p>
                    </div>
                @endif
            </div>
        </div>

    <!-- PROFILE WIDGET (Vanilla JS) -->
    <div id="profile-widget" class="hidden fixed z-50 transition-opacity duration-300"
         style="transform: translate(-50%, -100%); margin-top: -20px;">
        <div class="bg-white rounded-2xl shadow-2xl w-80 flex flex-col items-center justify-center p-6 relative transform transition-transform duration-300" 
             style="border: 4px solid #003366 !important; border-radius: 24px !important;"
             id="profile-content">
            
            <button onclick="closeProfile()" class="absolute text-gray-400 hover:text-gray-600 font-bold"
                    style="position: absolute; top: 10px; right: 10px; z-index: 10;">
                ✕
            </button>

            <!-- Avatar Container -->
            <div class="mb-3">
                <img id="profile-image" src="" class="hidden rounded-full object-cover border-4 border-gray-100 shadow-md" style="width: 72px !important; height: 72px !important;">
                <div id="profile-initial" class="hidden rounded-full text-white flex items-center justify-center text-2xl font-bold shadow-md border-4 border-white" style="width: 72px !important; height: 72px !important; background-color: #00A859;">
                    <span id="profile-initial-text"></span>
                </div>
            </div>

            <h2 id="profile-name" class="text-lg font-bold text-gray-900 border-b-2 border-transparent hover:border-[#003366] transition-colors cursor-default"></h2>
            <p id="profile-email" class="text-xs text-gray-500 mb-4"></p>
            
            <a id="profile-view-btn" href="#" 
               class="w-full py-2 rounded-xl text-white font-semibold shadow-md transition transform active:scale-95 flex items-center justify-center gap-2 text-sm mb-2"
               style="background-color: #00A859; border-radius: 16px !important;">
                Voir le profil
            </a>
            
            <a id="profile-dm-btn" href="#" 
               class="hidden w-full py-2 rounded-xl bg-[#003366] hover:bg-[#002244] text-white font-semibold shadow-md transition transform active:scale-95 flex items-center justify-center gap-2 text-sm"
               style="background-color: #003366; border-radius: 16px !important;">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                Envoyer un message
            </a>
        </div>
    </div>



    </div>

    <script>
        const scroller = document.getElementById('chat-scroller');
        if(scroller) scroller.scrollTop = scroller.scrollHeight;

        // Profile Widget Logic
        const widget = document.getElementById('profile-widget');
        const content = document.getElementById('profile-content');
        const imgEl = document.getElementById('profile-image');
        const initEl = document.getElementById('profile-initial');
        const initTextEl = document.getElementById('profile-initial-text');
        const nameEl = document.getElementById('profile-name');
        const emailEl = document.getElementById('profile-email');
        const viewProfileBtn = document.getElementById('profile-view-btn');
        const dmBtn = document.getElementById('profile-dm-btn');
        
        const currentUserId = {{ auth()->id() }};

        function openProfile(e, user) {
            // show the popup
            widget.classList.remove('hidden');
            
            const widgetWidth = content.offsetWidth;
            const widgetHeight = content.offsetHeight;
            
            let x = e.clientX;
            let y = e.clientY;

            // keep it on screen
            if (x + (widgetWidth / 2) > window.innerWidth) {
                x = window.innerWidth - (widgetWidth / 2) - 20;
            }
            if (x - (widgetWidth / 2) < 0) {
                x = (widgetWidth / 2) + 20;
            }
            if (y + 20 > window.innerHeight) {
                y = window.innerHeight - 20;
            }
            if (y - widgetHeight - 20 < 0) {
                y = widgetHeight + 40; 
            }

            widget.style.left = x + 'px';
            widget.style.top = y + 'px';

            // fill info
            nameEl.textContent = user.name;
            emailEl.textContent = user.email;

            if (user.profile_photo_path || user.profile_photo) {
                imgEl.src = '{{ url("/storage") }}/' + (user.profile_photo_path || user.profile_photo);
                imgEl.classList.remove('hidden');
                initEl.classList.add('hidden');
            } else {
                initTextEl.textContent = user.name.charAt(0).toUpperCase();
                imgEl.classList.add('hidden');
                initEl.classList.remove('hidden');
            }

            // Profile Link Logic
            viewProfileBtn.href = '/users/' + user.id;

            // DM Button Logic
            if (user.id != currentUserId) {
                dmBtn.href = '/chat/dm/' + user.id;
                dmBtn.classList.remove('hidden');
                dmBtn.classList.add('flex');
            } else {
                dmBtn.classList.add('hidden');
                dmBtn.classList.remove('flex');
            }

            // Show Widget with animation
            widget.classList.remove('hidden');
            setTimeout(() => {
                content.classList.remove('scale-95');
                content.classList.add('scale-100');
            }, 10);
        }

        function closeProfile() {
            content.classList.remove('scale-100');
            content.classList.add('scale-95');
            setTimeout(() => {
                widget.classList.add('hidden');
            }, 150);
        }

        // Close when clicking outside
        window.addEventListener('click', function(e) {
            if (!widget.classList.contains('hidden')) {
                if (!content.contains(e.target) && !e.target.closest('button[onclick*="openProfile"]')) {
                    closeProfile();
                }
            }
        });

        // Close on background click
        widget.addEventListener('click', (e) => {
            if (e.target === widget) closeProfile();
        });
        // Group Modal Logic
        const groupModal = document.getElementById('group-modal');
        const groupContent = document.getElementById('group-content');

        function openGroupModal() {
            if(!groupModal) return;
            groupModal.classList.remove('hidden');
            setTimeout(() => {
                groupContent.classList.remove('scale-95');
                groupContent.classList.add('scale-100');
            }, 10);
        }

        function closeGroupModal() {
            if(!groupModal) return;
            groupContent.classList.remove('scale-100');
            groupContent.classList.add('scale-95');
            setTimeout(() => {
                groupModal.classList.add('hidden');
            }, 150);
        }

        if(groupModal) {
            groupModal.addEventListener('click', (e) => {
                if(e.target === groupModal) closeGroupModal();
            });
        }

        // Attachment Modal Logic
        const attachmentModal = document.getElementById('attachment-modal');
        const attachmentContent = document.getElementById('attachment-content');
        
        function openAttachmentModal() {
            if(!attachmentModal) return;
            attachmentModal.classList.remove('hidden');
            setTimeout(() => {
                attachmentContent.classList.remove('scale-95');
                attachmentContent.classList.add('scale-100');
            }, 10);
        }
        
        function closeAttachmentModal() {
            if(!attachmentModal) return;
            attachmentContent.classList.remove('scale-100');
            attachmentContent.classList.add('scale-95');
            setTimeout(() => {
                attachmentModal.classList.add('hidden');
            }, 150);
        }
        
        function selectAttachmentType(type) {
            if(type === 'photo') {
                document.getElementById('attachment-photo').click();
            } else {
                document.getElementById('attachment-doc').click();
            }
            closeAttachmentModal();
        }
        
        function handleFileSelected(input) {
            if(input.files && input.files.length > 0) {
                const attachBtn = document.getElementById('attach-btn');
                attachBtn.classList.add('bg-green-100', 'text-green-600');
                
                // Disable the other input to prevent conflicts
                const docInput = document.getElementById('attachment-doc');
                const photoInput = document.getElementById('attachment-photo');
                if(input.id === 'attachment-doc') {
                    photoInput.disabled = true;
                } else {
                    docInput.disabled = true;
                }
            }
        }
        
        // Message Validation
        function validateMessage() {
            const msgInput = document.getElementById('msg-input');
            const content = msgInput.value.trim();
            
            // Check if both message and attachment are empty
            const docInput = document.getElementById('attachment-doc');
            const photoInput = document.getElementById('attachment-photo');
            const hasAttachment = (docInput && docInput.files.length > 0) || (photoInput && photoInput.files.length > 0);
            
            if(!content && !hasAttachment) {
                msgInput.classList.add('border-red-500', 'border-2');
                msgInput.placeholder = "Le message ne peut pas être vide !";
                setTimeout(() => {
                    msgInput.classList.remove('border-red-500', 'border-2');
                    msgInput.placeholder = "Écrivez votre message...";
                }, 2000);
                return false;
            }
            
            return true;
        }

        // Info Sidebar Logic
        const infoSidebar = document.getElementById('info-sidebar');
        function toggleInfoSidebar() {
            if(!infoSidebar) return;
            if (infoSidebar.classList.contains('hidden')) {
                infoSidebar.classList.remove('hidden');
            } else {
                infoSidebar.classList.add('hidden');
            }
        }
    </script>
</x-app-layout>
