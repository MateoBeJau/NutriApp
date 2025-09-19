// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Verificar token solo si es necesario
  const token = request.cookies.get('auth-token')?.value;
  
  // Rutas de autenticación
  const isAuthPage = pathname === '/auth/login' || pathname === '/auth/register';
  
  // Rutas protegidas - todas bajo /dashboard
  const isProtectedRoute = pathname.startsWith('/dashboard/pacientes') ||
                          pathname.startsWith('/dashboard/agenda') ||
                          pathname.startsWith('/dashboard/planes') ||
                          pathname.startsWith('/dashboard');

  // Redirección más rápida para auth pages
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url), { status: 302 });
  }

  // Redirección más rápida para rutas protegidas
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url), { status: 302 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};