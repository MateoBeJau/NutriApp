// src/app/auth/register/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword, generateToken, type AuthUser } from "@/lib/auth";
import { cookies } from "next/headers";

export async function registerAction(nombre: string, email: string, password: string) {
  const existingUser = await prisma.usuario.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error('Ya existe un usuario con este email');
  }

  const hashedPassword = await hashPassword(password);
  
  const user = await prisma.usuario.create({
    data: {
      email,
      passwordHash: hashedPassword,
      nombre
    }
  });

  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    nombre: user.nombre
  };

  const token = generateToken(authUser);
  
  const cookieStore = await cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60
  });

  return authUser;
}



