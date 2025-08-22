"use server";
import { signIn } from "@/auth";
import { LoginCredentials } from "@/types/auth";

export async function login({ email, password }: LoginCredentials) {
  await signIn("credentials", {
    redirect: true,
    email: email,
    password: password,
    redirectTo: "/portal/dashboard",
  });
}
