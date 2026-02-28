import type { Metadata } from "next";
import { Inter, Open_Sans } from "next/font/google";
import "@/public/styles/globals.css";
import "@/public/styles/landing.css";
import { RegisterProvider } from "@/contexts/register-context";
import { CookieConsentProvider } from "@/contexts/cookie-conset-context";
import CookieConsent from "@/shared/components/cookie-consent";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "Wundu | O Futuro das Tuas Finanças",
  description:
    "Descobre a Wundu — a plataforma inteligente que transforma a forma como geres, planeias e investes o teu dinheiro. Simplifica as tuas finanças e constrói o teu futuro financeiro com confiança.",
  keywords: [
    "finanças pessoais",
    "gestão financeira",
    "investimentos",
    "planeamento financeiro",
    "Wundu",
    "economia digital",
    "controle de despesas",
  ],
  authors: [{ name: "Wundu" }],
  openGraph: {
    title: "Wundu | O Futuro das Tuas Finanças",
    description:
      "A Wundu ajuda-te a dominar as tuas finanças com tecnologia inteligente e visão de futuro. Gere, poupa e investe com simplicidade.",
    url: "https://wundu-web.netlify.app",
    siteName: "Wundu",
    locale: "pt_PT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wundu | O Futuro das Tuas Finanças",
    description:
      "Simplifica a tua vida financeira com a Wundu — inovação e controlo ao teu alcance.",
    creator: "@wundu",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={`${inter.variable} ${openSans.variable} antialiased`} suppressHydrationWarning>
        <RegisterProvider>
          <CookieConsentProvider>
            {children}
            <CookieConsent />
          </CookieConsentProvider>
        </RegisterProvider>
      </body>
    </html>
  );
}
