import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mostra Cultural e de Itinerários Formativos 2026 | Colégio Benjamin Constant",
  description: "Plataforma oficial da Mostra Cultural e de Itinerários Formativos 2026 do Colégio Benjamin Constant. Socioecologia e Resiliência: como a Arte e a Ciência podem ajudar a moldar um amanhã sustentável.",
  icons: {
    icon: "/logo-benjamin.png",
    apple: "/logo-benjamin.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Footer />
      </body>
    </html>
  );
}
