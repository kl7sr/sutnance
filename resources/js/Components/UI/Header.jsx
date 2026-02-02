import { usePage } from '@inertiajs/react';

function Header() {
  const { auth } = usePage().props;
  const user = auth?.user;

  return (
    <header className="bg-white border-b-2 border-[#003366] shadow-sm sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Title */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block w-1.5 h-10 bg-[#8CC63F] rounded-full"></div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#003366] tracking-tight font-sans">
                SEAAL Workspace
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block font-sans">
                Gestion et communication
              </p>
            </div>
          </div>

          {/* Right Section - User Info & Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications Icon */}
            <button className="p-2 rounded-xl text-gray-600 hover:bg-[#F4F7F9] transition-colors relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {/* Notification Badge */}
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#8CC63F] rounded-full ring-2 ring-white"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-[#003366] font-sans">{user?.name || 'Utilisateur'}</p>
                <p className="text-xs text-gray-500 font-sans">{user?.email || ''}</p>
              </div>
              {user?.profile_photo ? (
                <img 
                  src={`/storage/${user.profile_photo}`} 
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#8CC63F] flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white">
                  <span className="text-sm">{user?.name?.charAt(0) || 'U'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
