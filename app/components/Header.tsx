"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, X } from "lucide-react";

export default function Header() {
  // ===== ESTADOS EXISTENTES =====
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isLightMode, setIsLightMode] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // ===== REFS =====
  const headerRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const lastScrollY = useRef(0);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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

  // ===== SCROLL BEHAVIOR =====
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
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

  // ===== SECTION COLOR CHANGE =====
  useEffect(() => {
    if (typeof window === "undefined") return;
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
      { threshold: 0.3, rootMargin: "-20% 0px -20% 0px" },
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

  // ===== FOCUS TRAP E GERENCIAMENTO DE FOCO =====
  useEffect(() => {
    if (!isMenuOpen || !menuRef.current) return;

    // Foco no botão de fechar ao abrir
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    const focusable = menuRef.current.querySelectorAll(
      'a, button, [tabindex]:not([tabindex="-1"])',
    );
    const firstFocusable = focusable[0] as HTMLElement;
    const lastFocusable = focusable[focusable.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setIsProductsDropdownOpen(false);
        hamburgerRef.current?.focus();
      }
      // Loop de foco dentro do drawer
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  // ===== BLOQUEAR SCROLL DO BODY =====
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isMenuOpen]);

  // ===== FECHAR DRAWER AO REDIMENSIONAR PARA DESKTOP =====
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen]);

  // ===== FECHAR DROPDOWN AO CLICAR FORA =====
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(e.target as Node)
      ) {
        setIsProductsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ===== HANDLERS DO DROPDOWN COM HOVER =====
  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setIsProductsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsProductsDropdownOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  // ===== TOGGLE MENU MOBILE =====
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsMobileProductsOpen(false);
    hamburgerRef.current?.focus();
  };

  // Fechar menu ao mudar de rota
  useEffect(() => {
    closeMenu();
  }, [pathname]);

  // ===== PREFERS-REDUCED-MOTION =====
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);
    const handler = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const transitionClass = prefersReducedMotion
    ? ""
    : "transition-all duration-300 ease-out";

  // ===== ITENS DO DROPDOWN =====
  const productDropdownItems = [
    { label: "Todos os produtos", href: "/product" },
    { label: "Álbum", href: "/product?search=album" },
    { label: "Photocards", href: "/product?categoria=photocards" },
    { label: "Lightsticks", href: "/product?categoria=Lightsticks" },
    { label: "Roupas", href: "/product?categoria=roupas" },
  ];

  // ===== LINKS DO MENU MOBILE (para evitar repetição) =====
  const mobileLinks = [
    { label: "Início", href: "/" },
    ...(isAdmin
      ? [
          { label: "Admin Produtos", href: "/product" },
          { label: "Novo Produto", href: "/product/create" },
        ]
      : []),
  ];

  return (
    <>
      <header
        ref={headerRef}
        className={`
          fixed top-0 left-0 w-full z-50
          ${isAtTop ? "header-glass-top" : "header-glass-scrolled"}
          ${isVisible ? "translate-y-0" : "-translate-y-full"}
          ${isLightMode ? "text-black" : "text-white"}
          border-b ${isLightMode ? "border-gray-200/50" : "border-zinc-800/50"}
          ${transitionClass}
          will-change-transform
          h-14 sm:h-16
        `}
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(-100%)",
          transition: prefersReducedMotion
            ? "none"
            : "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s ease",
        }}
      >
        {/* Linha de brilho no topo */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-pink-500 to-transparent animate-border-glow" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4 sm:gap-8">
          {/* LOGO */}
          <Link
            href="/"
            className="text-xl sm:text-2xl font-extrabold tracking-tight relative z-10 flex items-center gap-1"
            style={{ fontFamily: "var(--font-montserrat)" }}
            onClick={handleRipple}
          >
            BORA<span className="text-pink-500">HAUS</span>
          </Link>

          {/* NAVEGAÇÃO DESKTOP */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/"
              className={`relative nav-link ${
                pathname === "/" ? "text-pink-500" : "hover:text-pink-400"
              } ${transitionClass}`}
              onClick={handleRipple}
            >
              Início
            </Link>

            <Link
              href="/blog-bora-haus"
              className={`relative nav-link ${
                pathname === "/blog-bora-haus" ? "text-pink-500" : "hover:text-pink-400"
              } ${transitionClass}`}
              onClick={handleRipple}
            >
              Blog
            </Link>

            {/* Produtos com HOVER dropdown */}
            <div
              ref={dropdownContainerRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`
                  relative nav-link flex items-center gap-1
                  ${pathname.startsWith("/product") ? "text-pink-500" : "hover:text-pink-400"}
                  ${transitionClass}
                `}
                aria-haspopup="true"
                aria-expanded={isProductsDropdownOpen}
              >
                Produtos
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isProductsDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProductsDropdownOpen && (
                <div
                  className={`
                    absolute left-0 mt-2 w-48 rounded-xl shadow-xl
                    bg-zinc-900/95 backdrop-blur-sm border border-zinc-700/50
                    py-1 z-50 text-zinc-100
                  `}
                  style={{ minWidth: "160px" }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {productDropdownItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2.5 text-sm hover:bg-pink-500/20 transition-colors rounded-lg mx-1"
                      onClick={() => setIsProductsDropdownOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

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
          </nav>

          {/* HAMBURGER (Mobile) - área de toque ampliada */}
          <button
            ref={hamburgerRef}
            className="md:hidden relative z-20 w-10 h-10 flex flex-col justify-center items-center rounded-lg hover:bg-white/10 active:scale-95 transition-all duration-200"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <span
              className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-300 my-1 ${
                isMenuOpen ? "opacity-0 scale-x-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* MENU MOBILE (Drawer) */}
      <div
        ref={menuRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        className={`
          md:hidden fixed inset-0 top-14 sm:top-16 z-40
          transition-all duration-300 ease-in-out
          ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={closeMenu} // Fecha ao clicar no overlay
      >
        {/* Overlay com blur */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        {/* Painel do drawer */}
        <div
          className={`
            absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-zinc-900/95 backdrop-blur-md shadow-2xl
            flex flex-col p-6 pt-8
            transition-transform duration-300 ease-out
            ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
          `}
          onClick={(e) => e.stopPropagation()} // Impede fechamento ao clicar dentro
        >
          {/* Botão de fechar (X) - destaque e área de toque ampliada */}
          <button
            ref={closeButtonRef}
            onClick={closeMenu}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:scale-90 transition-all duration-200 text-white"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Navegação principal do drawer */}
          <nav className="flex flex-col gap-1 mt-4 text-base font-medium">
            {mobileLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  px-4 py-3 rounded-xl transition-colors
                  ${pathname === link.href ? "text-pink-500 bg-pink-500/10" : "text-zinc-100 hover:bg-white/5"}
                `}
                onClick={handleRipple}
              >
                {link.label}
              </Link>
            ))}

            {/* Produtos accordion mobile */}
            <div className="mt-1">
              <button
                className={`
                  w-full text-left px-4 py-3 rounded-xl transition-colors flex items-center justify-between
                  ${pathname.startsWith("/product") ? "text-pink-500 bg-pink-500/10" : "text-zinc-100 hover:bg-white/5"}
                `}
                onClick={() => setIsMobileProductsOpen((prev) => !prev)}
                aria-expanded={isMobileProductsOpen}
              >
                <span>Produtos</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isMobileProductsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isMobileProductsOpen && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-pink-500/30 pl-4">
                  {productDropdownItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-3 text-sm text-zinc-300 hover:text-pink-400 hover:bg-white/5 rounded-xl transition-colors"
                      onClick={handleRipple}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {isAdmin && (
              <button
                onClick={(e) => {
                  handleRipple(e);
                  handleLogout();
                }}
                className="px-4 py-3 text-left text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
              >
                Sair
              </button>
            )}
          </nav>

          {/* Botão de contato no rodapé do drawer */}
          <div className="mt-auto pt-6">
            <Link
              href="/contato"
              className="block w-full px-4 py-3.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl text-center font-semibold shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all duration-300 active:scale-[0.98]"
              onClick={handleRipple}
            >
              Contato
            </Link>
          </div>
        </div>
      </div>

      {/* Espaçador para compensar o header fixo */}
      <div className="h-14 sm:h-16" />

      <style jsx global>{`
        /* ===== ESTILOS DO HEADER ===== */
        .header-glass-top {
          background: rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(0px);
          -webkit-backdrop-filter: blur(0px);
          transition: backdrop-filter 0.3s ease, background 0.3s ease;
        }
        .header-glass-scrolled {
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: backdrop-filter 0.3s ease, background 0.3s ease;
        }
        .text-black .header-glass-scrolled {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .text-black .header-glass-top {
          background: rgba(255, 255, 255, 0.1);
        }

        /* ===== ANIMAÇÃO DO SUBLINHADO DOS LINKS ===== */
        .nav-link {
          position: relative;
          padding-bottom: 2px;
        }
        .nav-link::after {
          content: "";
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

        /* ===== BORDA GLOW ===== */
        @keyframes borderGlow {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .animate-border-glow {
          background-size: 200% 100%;
          animation: borderGlow 8s linear infinite;
        }

        /* ===== RIPPLE EFFECT ===== */
        .ripple-effect {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: scale(0);
          animation: rippleAnim 0.6s linear;
          pointer-events: none;
        }
        @keyframes rippleAnim {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }

        /* ===== REDUZIR ANIMAÇÕES ===== */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* ===== AJUSTES PARA TELAS MUITO PEQUENAS ===== */
        @media (max-width: 360px) {
          .header-glass-scrolled {
            backdrop-filter: blur(8px);
          }
          .w-80 {
            width: 85vw;
          }
        }
      `}</style>
    </>
  );
}