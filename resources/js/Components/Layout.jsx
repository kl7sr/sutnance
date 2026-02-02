import { useState, useEffect } from 'react';
import React from 'react';
import { usePage } from '@inertiajs/react';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const { props } = usePage();
  const { auth } = props;

  return (
    <div className="min-h-screen bg-seaal-gray font-sans">
      <Sidebar user={auth?.user} />

      {/* Main Content Area */}
      {/* Left margin matches the default sidebar width (w-72 = 18rem), adjusts for mobile */}
      <main className="transition-all duration-300 ease-in-out md:ml-72 min-h-screen">
        <div className="p-4 md:p-8 pt-20 md:pt-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
