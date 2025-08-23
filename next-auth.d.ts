import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: string; // ✅ Add role
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role: string; // ✅ Add role
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string; // ✅ Add role to token
  }
}
