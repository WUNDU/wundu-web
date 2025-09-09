import type { Metadata } from "next";
import { Inter, Open_Sans } from "next/font/google";
import "../src/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "Wundu",
  description: "Generated wundu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body
        className={`${inter.variable} ${openSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
