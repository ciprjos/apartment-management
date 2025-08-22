"use server";
import { signIn } from "@/auth";
import { LoginCredentials } from "@/types/auth";

export async function login({ email, password }: LoginCredentials) {
  const result = signIn("credentials", {
    redirect: false,
    email: email,
    password: password,
  });

  console.log(result);
}
