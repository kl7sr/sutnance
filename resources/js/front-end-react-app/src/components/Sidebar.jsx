// import { useState, useEffect } from 'react';

// function Sidebar({ isOpen, onClose }) {
//   const [activePath, setActivePath] = useState(() => {
//     if (typeof window !== 'undefined') {
//       return window.location.pathname;
//     }
//     return '/dashboard';
//   });

//   useEffect(() => {
//     const updatePath = () => {
//       if (typeof window !== 'undefined') {
//         setActivePath(window.location.pathname);
//       }
//     };
//     window.addEventListener('popstate', updatePath);
//     return () => window.removeEventListener('popstate', updatePath);
//   }, []);

//   const navItems = [
//     {
//       href: '/dashboard',
//       label: 'Tableau de bord',
//       icon: (
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
//         </svg>
//       ),
//     },
//     {
//       href: '/chat',
//       label: 'Chat d\'équipe',
//       icon: (
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
//         </svg>
//       ),
//     },
//     {
//       href: '/announcements',
//       label: 'Annonces',
//       icon: (
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
//         </svg>
//       ),
//     },
//     {
//       href: '/users',
//       label: 'Gérer les utilisateurs',
//       icon: (
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
//         </svg>
//       ),
//       adminOnly: true,
//     },
//   ];

//   const handleNavClick = (href) => {
//     setActivePath(href);
//     if (window.innerWidth < 1024) onClose();
//   };

//   const isActive = (href) => activePath === href || activePath.startsWith(href + '/');

//   return (
//     <>
//       {/* Sidebar Overlay for Mobile */}
//       {isOpen && (
//         <div 
//           className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
//           onClick={onClose}
//         />
//       )}

//       <aside className={`
//         fixed lg:static inset-y-0 left-0 z-50
//         w-72 bg-[#001A33] text-white
//         flex flex-col shadow-2xl
//         transform transition-all duration-300 ease-in-out
//         ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
//       `}>
//         {/* Header Section */}
//         <div className="px-8 py-12 border-b border-white/5">
//           <div className="flex flex-col items-center gap-4">
//             <div className="p-2 bg-white rounded-2xl shadow-xl">
//                <img 
//                 src="https://www.areal-topkapi.com/sites/default/files/2020-09/logo-seaal.jpg" 
//                 alt="SEAAL Logo" 
//                 className="w-16 h-16 object-contain"
//               />
//             </div>
//             <div className="text-center">
//                 <h3 className="text-xl font-bold tracking-tight text-white uppercase">Workspace</h3>
//                 <div className="h-1 w-12 bg-[#8CC63F] mx-auto mt-2 rounded-full" />
//             </div>
//           </div>
//         </div>
        
//         {/* Navigation Section */}
//         <nav className="flex-1 px-4 py-8 overflow-y-auto">
//           <ul className="space-y-2">
//             {navItems.map((item) => {
//               const active = isActive(item.href);
//               return (
//                 <li key={item.href}>
//                   <a
//                     href={item.href}
//                     onClick={(e) => {
//                       e.preventDefault();
//                       handleNavClick(item.href);
//                       window.location.href = item.href;
//                     }}
//                     className={`
//                       group relative flex items-center gap-4 px-5 py-4 rounded-xl
//                       transition-all duration-200
//                       ${active 
//                         ? 'bg-white/10 text-white shadow-inner' 
//                         : 'text-white/60 hover:bg-white/5 hover:text-white'
//                       }
//                     `}
//                   >
//                     {/* Active Indicator Bar */}
//                     {active && (
//                       <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-[#8CC63F] rounded-r-full shadow-[0_0_10px_#8CC63F]" />
//                     )}
                    
//                     <span className={`transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
//                       {item.icon}
//                     </span>
                    
//                     <span className="text-sm font-semibold tracking-wide uppercase">
//                       {item.label}
//                     </span>
//                   </a>
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>

//         {/* Logout Section */}
//         <div className="p-6 border-t border-white/5 bg-black/10">
//           <form method="POST" action="/logout">
//             <button
//               type="submit"
//               className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all duration-300 font-bold border border-red-500/20 shadow-lg group"
//             >
//               <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
//               </svg>
//               <span>DÉCONNEXION</span>
//             </button>
//           </form>
//         </div>
//       </aside>
//     </>
//   );
// }

// export default Sidebar;





import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function Sidebar({ isOpen, onClose }) {
  const [activePath, setActivePath] = useState(
    typeof window !== 'undefined' ? window.location.pathname : '/dashboard'
  );

  useEffect(() => {
    const handler = () => setActivePath(window.location.pathname);
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  const navItems = [
    { href: '/dashboard', label: 'Tableau de bord' },
    { href: '/chat', label: 'Chat d’équipe' },
    { href: '/announcements', label: 'Annonces' },
    { href: '/users', label: 'Utilisateurs' },
  ];

  const isActive = (href) =>
    activePath === href || activePath.startsWith(href + '/');

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 bg-[#001A33] text-white
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-white/10 text-center font-bold">
          SEAAL
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => {
                setActivePath(item.href);
                onClose();
                router.visit(item.href);
              }}
              className={`
                w-full text-left px-4 py-3 rounded-lg
                transition
                ${
                  isActive(item.href)
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => router.post('/logout')}
            className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 transition"
          >
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}
