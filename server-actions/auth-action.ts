"use server";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { LoginCredentials } from "@/types/auth";

export async function login({ email, password }: LoginCredentials) {
  return await signIn("credentials", {
    redirect: true,
    email: email,
    password: password,
    redirectTo: "/portal/dashboard",
  });
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}

export async function getUserRole(id: string) {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      role: true,
    },
  });
}
