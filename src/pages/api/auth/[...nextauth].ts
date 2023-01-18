import NextAuth, { type NextAuthOptions } from "next-auth";
import type { GithubProfile } from "next-auth/providers/github";
import GithubProvider from "next-auth/providers/github";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider<GithubProfile>({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      profile: (profile) => ({
        id: profile.id.toString(),
        name: profile.name,
        email: profile.email,
        image: profile.avatar_url,
      }),
    }),
  ],
};

export default NextAuth(authOptions);
