import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "BORA HAUS – Loja de K-pop confiável",
  description: "Compre álbuns, photocards e produtos digitais de K-pop com segurança via Amazon, Shopee e Hotmart.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}