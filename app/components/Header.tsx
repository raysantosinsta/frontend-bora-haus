"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isLightMode, setIsLightMode] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const headerRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const lastScrollY = useRef(0);
  const pathname = usePathname();
  const router = useRouter();

  // ===== ADMIN AUTH =====
  useEffect(() => {
    const auth = localStorage.getItem("adminAuthenticated") === "true";
    setIsAdmin(auth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    setIsAdmin(false);
    router.push("/");
  };

  // ===== SCROLL BEHAVIOR (Collapsible com delay e easing) =====
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Só esconde se rolar para baixo e não estiver no topo
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      }
      setIsAtTop(currentScrollY < 50);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ===== SCROLL-DRIVEN BLUR & OPACITY (via CSS + fallback) =====
  // O efeito de blur é aplicado via classe CSS baseada no scroll, mas também usamos state para garantir
  const headerBlurClass = isAtTop ? "header-glass-top" : "header-glass-scrolled";

  // ===== SECTION COLOR CHANGE (Intersection Observer) =====
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Observa seções com data-color="light" ou "dark"
    const sections = document.querySelectorAll("[data-header-color]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const color = entry.target.getAttribute("data-header-color");
            setIsLightMode(color === "light");
          }
        });
      },
      { threshold: 0.3, rootMargin: "-20% 0px -20% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // ===== MAGNETIC BUTTON EFFECT =====
  useEffect(() => {
    if (!ctaRef.current) return;
    const cta = ctaRef.current;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = cta.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      // Fator de magnetismo (0.2 para suavidade)
      setMousePosition({ x: x * 0.2, y: y * 0.2 });
    };
    const handleMouseLeave = () => setMousePosition({ x: 0, y: 0 });
    cta.addEventListener("mousemove", handleMouseMove);
    cta.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      cta.removeEventListener("mousemove", handleMouseMove);
      cta.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // ===== RIPPLE EFFECT =====
  const handleRipple = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.className = "ripple-effect";
    target.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  // ===== FOCUS TRAP PARA MENU MOBILE =====
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isMenuOpen || !menuRef.current) return;
    const focusable = menuRef.current.querySelectorAll(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length) {
      (focusable[0] as HTMLElement).focus();
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  // ===== TOGGLE MENU COM MORPHING =====
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // ===== CLOSE MENU AO NAVEGAR =====
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // ===== PREFERS-REDUCED-MOTION =====
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);
    const handler = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  // Classe condicional para animações suaves ou instantâneas
  const transitionClass = prefersReducedMotion ? "" : "transition-all duration-300 ease-out";

  return (
    <>
      {/* HEADER PRINCIPAL */}
      <header
        ref={headerRef}
        className={`
          fixed top-0 left-0 w-full z-50
          ${headerBlurClass}
          ${isVisible ? "translate-y-0" : "-translate-y-full"}
          ${isLightMode ? "text-black" : "text-white"}
          border-b ${isLightMode ? "border-gray-200/50" : "border-zinc-800/50"}
          ${transitionClass}
          will-change-transform
        `}
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(-100%)",
          transition: prefersReducedMotion
            ? "none"
            : "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s ease",
        }}
      >
        {/* Borda viva animada (topo) */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-pink-500 to-transparent animate-border-glow" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4 sm:gap-8">
            {/* LOGO com animação de stroke (opcional) */}
            <Link
              href="/"
              className="text-2xl font-extrabold tracking-tight relative z-10"
              style={{ fontFamily: "var(--font-montserrat)" }}
              onClick={handleRipple}
            >
              BORA<span className="text-pink-500">HAUS</span>
            </Link>

            {/* NAVEGAÇÃO DESKTOP */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              {[
                { href: "/", label: "Início" },
                { href: "/product", label: "Produtos" },
                ...(isAdmin
                  ? [
                      { href: "/admin/products", label: "Admin Produtos" },
                      { href: "/admin/products/novo", label: "Novo Produto" },
                    ]
                  : []),
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`
                    relative nav-link
                    ${pathname === href ? "text-pink-500" : "hover:text-pink-400"}
                    ${transitionClass}
                  `}
                  onClick={handleRipple}
                >
                  {label}
                </Link>
              ))}

              {isAdmin && (
                <button
                  onClick={(e) => {
                    handleRipple(e);
                    handleLogout();
                  }}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Sair
                </button>
              )}

              {/* CTA MAGNÉTICO */}
            </nav>

            {/* HAMBURGER (Mobile) */}
            <button
              className="md:hidden relative z-20 w-8 h-8 flex flex-col justify-center items-center space-y-1.5"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isMenuOpen}
            >
              <span
                className={`
                  block h-0.5 w-6 rounded-full bg-current transition-all duration-300
                  ${isMenuOpen ? "rotate-45 translate-y-2" : ""}
                `}
              />
              <span
                className={`
                  block h-0.5 w-6 rounded-full bg-current transition-all duration-300
                  ${isMenuOpen ? "opacity-0 scale-x-0" : ""}
                `}
              />
              <span
                className={`
                  block h-0.5 w-6 rounded-full bg-current transition-all duration-300
                  ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}
                `}
              />
            </button>
          </div>
        </div>

        {/* OVERLAY + MENU MOBILE (com focus trap) */}
        <div
          ref={menuRef}
          className={`
            md:hidden fixed inset-0 top-16 z-40 bg-black/50 backdrop-blur-sm
            transition-all duration-300 ease-in-out
            ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
          `}
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className={`
              absolute right-0 top-0 w-64 h-full bg-white dark:bg-zinc-900 shadow-xl
              p-6 flex flex-col gap-4 text-base font-medium
              transition-transform duration-300 ease-out
              ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Links mobile */}
            {[
              { href: "/", label: "Início" },
              { href: "/product", label: "Produtos" },
              ...(isAdmin
                ? [
                    { href: "/admin/products", label: "Admin Produtos" },
                    { href: "/admin/products/novo", label: "Novo Produto" },
                  ]
                : []),
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`
                  px-4 py-2 rounded-lg hover:bg-pink-500/10 transition-colors
                  ${pathname === href ? "text-pink-500" : ""}
                `}
                onClick={handleRipple}
              >
                {label}
              </Link>
            ))}
            {isAdmin && (
              <button
                onClick={(e) => {
                  handleRipple(e);
                  handleLogout();
                }}
                className="px-4 py-2 text-left text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                Sair
              </button>
            )}
            <Link
              href="/contato"
              className="mt-auto px-4 py-3 bg-pink-500 text-white rounded-full text-center font-semibold shadow-lg shadow-pink-500/30"
              onClick={handleRipple}
            >
              Contato
            </Link>
          </div>
        </div>
      </header>

      {/* SPACER para evitar que o conteúdo fique atrás do header fixo */}
      <div className="h-16" />

      {/* ESTILOS GLOBAIS (adicione no global.css ou no componente com <style> ) */}
      <style jsx global>{`
        /* ===== HEADER GLASS MORPHISM ===== */
        .header-glass-top {
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(0px);
          -webkit-backdrop-filter: blur(0px);
          transition: backdrop-filter 0.3s ease, background 0.3s ease;
        }
        .header-glass-scrolled {
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: backdrop-filter 0.3s ease, background 0.3s ease;
        }
        /* Modo claro (seção light) - sobrescreve */
        .text-black .header-glass-scrolled {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .text-black .header-glass-top {
          background: rgba(255, 255, 255, 0.1);
        }

        /* ===== UNDERLINE MAGNÉTICO ===== */
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #ec4899, #f472b6);
          transition: width 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          box-shadow: 0 0 8px #ec4899;
        }
        .nav-link:hover::after {
          width: 120%;
          left: -10%;
        }
        .nav-link.active::after {
          width: 100%;
        }

        /* ===== BORDA VIVA ===== */
        @keyframes borderGlow {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-border-glow {
          background-size: 200% 100%;
          animation: borderGlow 8s linear infinite;
        }

        /* ===== RIPPLE EFFECT ===== */
        .ripple-effect {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          transform: scale(0);
          animation: rippleAnim 0.6s linear;
          pointer-events: none;
        }
        @keyframes rippleAnim {
          to { transform: scale(4); opacity: 0; }
        }

        /* ===== REDUZIDO ===== */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* ===== RESPONSIVO ===== */
        @media (max-width: 768px) {
          .header-glass-scrolled {
            backdrop-filter: blur(8px);
          }
        }
      `}</style>
    </>
  );
}