// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth/login') || 
                     request.nextUrl.pathname.startsWith('/auth/register');
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/pacientes') ||
                          request.nextUrl.pathname.startsWith('/agenda') ||
                          request.nextUrl.pathname.startsWith('/planes');

  // Si está en página de auth y tiene token, redirigir a pacientes
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/pacientes', request.url));
  }

  // Si está en ruta protegida y no tiene token, redirigir a login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};