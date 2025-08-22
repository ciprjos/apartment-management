"use server";
import { signIn, signOut } from "@/auth";
import { LoginCredentials } from "@/types/auth";

export async function login({ email, password }: LoginCredentials) {
  const result = await signIn("credentials", {
    redirect: false,
    email: email,
    password: password,
    redirectTo: "/portal/dashboard",
  });

  if (result.error) {
    console.error("Login error:", result.error);
    return {
      error: result.error,
    };
  }

  return {
    user: result.user,
  };
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}
