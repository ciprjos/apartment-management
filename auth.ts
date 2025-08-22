import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./lib/prisma";
import argon2 from "argon2";
import { User } from "./types/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { tenant: true },
        });
        if (!user) return null;
        const valid = await argon2.verify(
          user.password,
          credentials.password as string
        );
        if (!valid) return null;
        // Remove password before returning user object

        const userDetails: User = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };

        return userDetails;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.email = token.email as string;
        session.user.id = token.id as string;
        session.user.name = token.name as string | null;
        session.user.image = token.image as string | null;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
        token.email = user.email;
        token.id = user.id;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
  },
});
