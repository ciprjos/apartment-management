import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { User } from "./types/user";
import { prisma } from "./lib/prisma";
import { verifyPassword } from "./lib/password";

export const runtime = "nodejs";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { tenant: true },
        });

        if (!user) {
          return null;
        }

        const valid = await verifyPassword(
          credentials.password as string,
          user.password as string
        );

        if (!valid) {
          return null;
        }
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
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.email = token.email as string;
        session.user.id = token.id as string;
        session.user.name = token.name as string | null;
        session.user.image = token.image as string | null;
        session.user.role = token.role as string;
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
        token.role = user.role;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
    signOut: "/login",
  },
});
