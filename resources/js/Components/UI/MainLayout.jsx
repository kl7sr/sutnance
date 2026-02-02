import React from 'react';
import { usePage } from '@inertiajs/react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function MainLayout({ children }) {
    const { props } = usePage();
    const { auth } = props;

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans flex text-gray-800">
            {/* Sidebar - handles its own mobile state internally */}
            <Sidebar user={auth?.user} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out md:ml-72 min-h-screen">
                {/* Header */}
                <Header />

                {/* Content - White card-like container */}
                <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
