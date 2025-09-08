import type { Metadata } from "next";
import { Poppins, Open_Sans } from "next/font/google";
import "../src/styles/globals.css";

const geistSans = Open_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Poppins({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "700"]
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
