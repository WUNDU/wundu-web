import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

/**
 * NextAuth apenas trata o OAuth do Google e expõe o `id_token` assinado pela
 * Google. Esse `idToken` é depois enviado para o backend Wundu
 * (/auth/google/login | /auth/google/register), que o valida e devolve o JWT
 * próprio da Wundu + cookie de refresh. NextAuth não é a fonte de sessão da app.
 */
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId:
        process.env.NEXT_AUTH_GOOGLE_CLIENT_ID ??
        process.env.GOOGLE_CLIENT_ID ??
        "",
      clientSecret:
        process.env.NEXT_AUTH_GOOGLE_CLIENT_SECRET ??
        process.env.GOOGLE_CLIENT_SECRET ??
        "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account }) {
      // Guarda o id_token da Google (JWT) na primeira autenticação.
      if (account?.provider === "google") {
        token.idToken = account.id_token;
        token.googleId = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.googleId = token.googleId;
      }
      session.idToken = token.idToken;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
