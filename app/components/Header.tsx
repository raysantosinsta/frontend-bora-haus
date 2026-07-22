"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16 gap-8">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-white"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            BORA<span className="text-pink-500">HAUS</span>
          </Link>

          {/* Navegação centralizada */}
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link
              href="/"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Início
            </Link>
            <Link
              href="/product"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Produtos
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}