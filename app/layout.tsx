import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Manrope, Open_Sans } from "next/font/google";
import "@/public/styles/globals.css";
import "app/components/ai/wundu-ai.css";
import "./(auth)/auth-ds.css";
import { CookieConsentProvider } from "@/contexts/cookie-conset-context";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { SessionProvider } from "@/components/providers/session-provider";
import { ThemeApplier } from "@/components/providers/theme-applier";
import Script from "next/script";

const THEME_INIT_SCRIPT = `try{var t=null;try{var s=JSON.parse(localStorage.getItem('wundu-theme-store')||'null');t=s&&s.state&&s.state.theme}catch(e){}if(t!=='dark'&&t!=='light'){try{var l=localStorage.getItem('wundu-theme');t=(l==='dark'||l==='light')?l:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch(e){t='light'}}document.documentElement.setAttribute('data-theme',t||'light')}catch(e){}`;
import { QueryProvider } from "@/components/providers/query-provider";
import { PostHogPageView } from "@/components/providers/posthog-pageview";
import { AnalyticsProvider } from "@/contexts/analytics-context";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  preload: false,
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  preload: false,
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  preload: false,
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
    <html lang="pt" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${openSans.variable} ${manrope.variable} antialiased`}
        suppressHydrationWarning
      >
        <Script id="wundu-theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <ThemeApplier />
        <SessionProvider>
          <QueryProvider>
            <AnalyticsProvider>
              <CookieConsentProvider>
              <Suspense fallback={null}>
                <PostHogPageView />
              </Suspense>
              {children}
              <CookieConsent />
              <Toaster
                position="top-right"
                closeButton
                richColors={false}
                theme="light"
                expand={false}
                gap={12}
              />
              </CookieConsentProvider>
            </AnalyticsProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
