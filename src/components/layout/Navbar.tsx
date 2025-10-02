"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Menu, User, LogOut } from "lucide-react";
import { logoutAction } from "@/app/auth/logout/actions";

interface NavbarProps {
  user: {
    id: string;
    email: string;
    nombre?: string;
  };
  onMenuClick: () => void; // ✅ Prop para abrir el sidebar móvil
}

export default function Navbar({ user, onMenuClick }: NavbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <div className="sticky top-0 z-40 flex h-16 w-full shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden hover:bg-gray-100 rounded-lg transition-colors"
        onClick={onMenuClick} // ✅ Agregado onClick
      >
        <span className="sr-only">Abrir sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

      {/* Spacer para empujar el contenido a la derecha */}
      <div className="flex-1" />

      {/* Right side content */}
      <div className="flex items-center gap-x-4 lg:gap-x-6">
        {/* Notifications */}
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Ver notificaciones</span>
          <Bell className="h-6 w-6" aria-hidden="true" />
        </button>

        {/* Separator */}
        <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

        {/* Profile dropdown */}
        <div className="relative">
          <button
            type="button"
            className="-m-1.5 flex items-center p-1.5"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <span className="sr-only">Abrir menú de usuario</span>
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <span className="hidden lg:flex lg:items-center">
              <span className="ml-4 text-sm font-semibold leading-6 text-gray-900">
                {user.nombre || user.email}
              </span>
            </span>
          </button>

          {/* Dropdown menu */}
          {isProfileOpen && (
            <div className="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-xl bg-white py-2 shadow-lg ring-1 ring-gray-900/5 border border-gray-200 focus:outline-none">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.nombre || user.email}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <Link
                href="/dashboard/perfil"
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User className="h-4 w-4 mr-2 text-gray-400" />
                Mi perfil
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2 text-gray-400" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}