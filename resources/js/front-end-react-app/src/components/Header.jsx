function Header({ onMenuClick }) {
  return (
    <header className="bg-white border-b-2 border-[#003366] shadow-sm">
      <div className="px-8 sm:px-10 lg:px-16 py-6">
        <div className="flex items-center justify-between">
          {/* Left Section - Mobile Menu & Title */}
          <div className="flex items-center gap-6">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2.5 rounded-lg text-gray-600 hover:bg-[#003366] hover:text-white transition-all duration-300 ease-in-out hover:scale-110 active:scale-95"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
            
            {/* Page Title with SEAAL Accent */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block w-1 h-12 bg-[#8CC63F] rounded-full"></div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#003366] tracking-tight">
                  SEAAL Workspace
                </h1>
                <p className="text-sm text-gray-500 mt-1.5 hidden sm:block">
                  Gestion et communication
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - User Info & Actions */}
          <div className="flex items-center gap-6">
            {/* Notifications Icon */}
            <button className="p-2.5 rounded-lg text-gray-600 hover:bg-[#003366] hover:text-white transition-all duration-300 ease-in-out hover:scale-110 active:scale-95 relative group">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              {/* Notification Badge with SEAAL green */}
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#8CC63F] rounded-full border-2 border-white"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-4 pl-6 border-l-2 border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-[#003366]">Utilisateur</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#8CC63F] flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-white">
                U
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
