// src/app/auth/login/page.tsx
import { redirect } from 'next/navigation';
import { prisma } from "@/lib/prisma";
import { verifyPassword, generateToken } from "@/lib/auth";
import { cookies } from "next/headers";

export default async function LoginPage({ 
  searchParams 
}: { 
  searchParams?: { error?: string } 
}) {
  // ✅ AWAIT searchParams en Next.js 15
  const resolvedSearchParams = await searchParams;
  const error = resolvedSearchParams?.error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accede a tu cuenta de nutricionista
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <form action={async (formData: FormData) => {
          'use server';
          
          const email = formData.get('email') as string;
          const password = formData.get('password') as string;

          if (!email || !password) {
            redirect("/auth/login?error=Email y contraseña son requeridos");
          }

          try {
            const usuario = await prisma.usuario.findUnique({
              where: { email }
            });

            if (!usuario) {
              redirect("/auth/login?error=Credenciales inválidas");
            }

            const isValidPassword = await verifyPassword(password, usuario.passwordHash);
            if (!isValidPassword) {
              redirect("/auth/login?error=Credenciales inválidas");
            }

            const token = generateToken({
              id: usuario.id,
              email: usuario.email,
              nombre: usuario.nombre
            });

            const cookieStore = await cookies();
            cookieStore.set('auth-token', token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 60 * 60 * 24 * 7
            });

            redirect("/dashboard");
          } catch (error) {
            console.error("Error en login:", error);
            redirect("/auth/login?error=Error interno del servidor");
          }
        }} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="tu@email.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Tu contraseña"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Iniciar Sesión
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <a href="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                Regístrate aquí
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}