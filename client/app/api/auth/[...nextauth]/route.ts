import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { oauthLogin } from "@/services/auth.service";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      try {
        const data = await oauthLogin({
          name: user.name,
          email: user.email,
          image: user.image,
          provider: account?.provider as "google" | "github" | undefined,
        });

        (user as { backendToken?: string }).backendToken = (data as { token?: string }).token;

        return true;
      } catch (error) {
        console.error("OAuth backend error:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      // On first sign-in, user object is available — store the backend token in the JWT
      if (user && (user as { backendToken?: string }).backendToken) {
        token.backendToken = (user as { backendToken?: string }).backendToken;
      }
      return token;
    },

    async session({ session, token }) {
      // Expose the backend token on the session so client can read it
      (session as { backendToken?: unknown }).backendToken = token.backendToken;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };