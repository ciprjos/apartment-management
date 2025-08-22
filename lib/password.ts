"use server";

import { verify } from "argon2";

export async function verifyPassword(password: string, hashedPassword: string) {
  return await verify(hashedPassword, password);
}
