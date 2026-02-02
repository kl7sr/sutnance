// import { useState } from 'react';
// import Sidebar from './Sidebar';
// import Header from './Header';
// import { motion, AnimatePresence } from 'framer-motion';

// function Layout({ children }) {
//   // نجعل السايدبار مفتوحاً افتراضياً في الشاشات الكبيرة
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   return (
//     <div className="flex min-h-screen bg-[#F4F7F9] font-sans">
//       {/* Sidebar - سنقوم بتمرير الحالة له */}
//       <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
//       {/* Main Content Area */}
//       <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : ''}`}>
        
//         {/* Header - نربط زر المنيو بفتح السايدبار */}
//         <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
//         {/* Page Content */}
//         <main className="flex-1 p-4 sm:p-6 lg:p-8">
//   // الكود المصحح داخل Sidebar.jsx
// <motion.div
//     initial="collapsed" // الحالة الابتدائية
//     animate={isCollapsed ? 'collapsed' : 'expanded'} // الحالة المتحركة (تأكد من عدم تكرارها)
//     variants={sidebarVariants}
//     style={{ backgroundColor: '#001A33', opacity: 1 }}
//     className={`fixed lg:static inset-y-0 left-0 z-50 w-72 flex flex-col transition-all duration-300`}
// >
//             {children}
//           </motion.div>
//         </main>
//       </div>
      
//       {/* Mobile Overlay - يظهر فقط في الشاشات الصغيرة */}
//       <AnimatePresence>
//         {sidebarOpen && (
//           <motion.div 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-[#001A33]/40 backdrop-blur-sm z-40 lg:hidden"
//             onClick={() => setSidebarOpen(false)}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// export default Layout;




import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { AnimatePresence, motion } from 'framer-motion';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-[#F4F7F9] font-sans">
      
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-72">
        
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Page */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
