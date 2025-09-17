// src/app/auth/login/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { verifyPassword, generateToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  try {
    // Leer datos del formulario
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // TODO: Aquí debes manejar la validación/creación de sesión
    // 1. Validar que email y password no estén vacíos
    if (!email || !password) {
      return redirect("/auth/login?error=Email y contraseña son requeridos");
    }

    // 2. Buscar usuario por email
    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario) {
      return redirect("/auth/login?error=Credenciales inválidas");
    }

    // 3. Verificar contraseña
    const isValidPassword = await verifyPassword(password, usuario.passwordHash);
    if (!isValidPassword) {
      return redirect("/auth/login?error=Credenciales inválidas");
    }

    // 4. Generar token JWT
    const token = generateToken({
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre
    });

    // 5. Guardar token en cookie httpOnly
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 días
    });

    // 6. Redirigir a la página de pacientes
    redirect("/pacientes");
  } catch (error) {
    console.error("Error en login:", error);
    return redirect("/auth/login?error=Error interno del servidor");
  }
}



