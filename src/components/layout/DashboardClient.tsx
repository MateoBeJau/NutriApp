"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface DashboardClientProps {
  user: {
    id: string;
    email: string;
    nombre?: string;
  };
  children: React.ReactNode;
}

export default function DashboardClient({ user, children }: DashboardClientProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      
      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Navbar */}
        <Navbar 
          user={user}
          onMenuClick={() => setIsMobileSidebarOpen(true)}
        />
        
        {/* Page Content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

