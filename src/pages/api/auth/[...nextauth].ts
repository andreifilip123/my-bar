// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import type { GithubProfile } from "next-auth/providers/github";
import GithubProvider from "next-auth/providers/github";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db";
import sendVerificationRequest from "./sendVerificationRequest";

export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.user = { id: user.id };
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
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
    EmailProvider({
      server: env.EMAIL_SERVER,
      from: env.EMAIL_FROM,
      sendVerificationRequest,
    }),
  ],
};

export default NextAuth(authOptions);
