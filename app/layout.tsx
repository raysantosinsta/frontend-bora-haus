// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Montserrat, Geist } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { cn } from "@/lib/utils";
import ToastProvider from "./components/blog-components/ToastProvider"; // importe o ToastProvider

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239b59b6'><path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/></svg>",
    shortcut: "/shortcut-icon.png",
    apple: "/apple-touch-icon.png",
  },
  title: "BORA HAUS – Loja de K-pop confiável",
  description: "Compre álbuns, photocards e produtos digitais de K-pop com segurança via Amazon, Shopee e Hotmart.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={cn("h-full", "antialiased", inter.variable, montserrat.variable, "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <Header />
        <main className="flex-1">{children}</main>
        <ToastProvider /> {/* Adicionado aqui */}
      </body>
    </html>
  );
}