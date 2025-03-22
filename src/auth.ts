import NextAuth, { CredentialsSignin, NextAuthConfig, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInSchema } from "./types/user";
import { signInAction } from "./actions/auth";
class InvalidLoginError extends CredentialsSignin {
  constructor(message: string) {
    super();
    this.code = message
  }
}


export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credential",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        try {
          const { email, password } = signInSchema.parse(credentials);
          const formData = new FormData();
          formData.append("email", email);
          formData.append("password", password);
          const result = await signInAction(formData);
          if (result.error || !result.data) {
            throw new Error(result.error);
          }
          return result.data || ({} as User);
        } catch (error) {
          console.error((error as Error).message);
          throw new InvalidLoginError((error as Error).message || "Authentication failed");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.name = user.name as string;
        token.email = user.email as string;
        token.roleId = user.roleId as number;
        token.isAdmin = user.isAdmin as boolean
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.roleId = token.roleId as number;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
    async authorized(data) {
      console.log("callback data: ", data.auth);
      return !!data.auth;
    },
  },
  pages: {
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
