// src/app/auth/register/page.tsx - Versión mejorada

import { redirect } from 'next/navigation';
import { registerAction } from './actions'; // ✅ Import correcto

export default async function RegisterPage({ 
  searchParams 
}: { 
  searchParams?: { error?: string } 
}) {
  // 🚫 Deshabilitar registro en producción
  if (process.env.NODE_ENV === 'production') {
    redirect('/auth/login');
  }

  // ✅ AWAIT searchParams en Next.js 15
  const resolvedSearchParams = await searchParams;
  const error = resolvedSearchParams?.error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Regístrate como nutricionista
          </p>
        </div>

        {/* Mostrar errores */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error === 'passwords-dont-match' && 'Las contraseñas no coinciden'}
            {error === 'email-exists' && 'Ya existe un usuario con este email'}
            {error === 'missing-fields' && 'Todos los campos son requeridos'}
            {error === 'validation-error' && 'Error de validación en los datos'}
          </div>
        )}
        
        <form action={async (formData: FormData) => {
          'use server';
          
          const nombre = formData.get('nombre') as string;
          const email = formData.get('email') as string;
          const password = formData.get('password') as string;
          const confirmPassword = formData.get('confirmPassword') as string;
          
          // Validación básica
          if (!nombre || !email || !password || !confirmPassword) {
            redirect('/auth/register?error=missing-fields');
          }
          
          if (password !== confirmPassword) {
            redirect('/auth/register?error=passwords-dont-match');
          }
          
          try {
            await registerAction(nombre, email, password);
            redirect('/pacientes');
          } catch (error) {
            console.error('Register failed:', error);
            
            // Manejar diferentes tipos de errores
            if (error instanceof Error) {
              if (error.message.includes('Ya existe un usuario')) {
                redirect('/auth/register?error=email-exists');
              } else if (error.message.includes('Error de validación')) {
                redirect('/auth/register?error=validation-error');
              }
            }
            
            // Error genérico
            redirect('/auth/register?error=email-exists');
          }
        }} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                Nombre Completo
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                autoComplete="name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Tu nombre completo"
              />
            </div>
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
                autoComplete="new-password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Repite tu contraseña"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Crear Cuenta
            </button>
          </div>

          <div className="text-center">
            <a href="/auth/login" className="text-indigo-600 hover:text-indigo-500">
              ¿Ya tienes cuenta? Inicia sesión aquí
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}