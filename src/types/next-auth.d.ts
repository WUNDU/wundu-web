import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    // id_token assinado pela Google, enviado ao backend Wundu para validação.
    idToken?: string;
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      googleId?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    idToken?: string;
    googleId?: string;
  }
}
