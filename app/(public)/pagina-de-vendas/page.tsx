"use client";

import { mockProducts, Product } from "@/data/mockProducts";
import { Fraunces, Inter, Manrope } from "next/font/google";
import {
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-utility",
});

const CONTACT_HREF = "#contato";

/* ------------------------------------------------------------------------ */
/* Hooks                                                                    */
/* ------------------------------------------------------------------------ */

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

/* ------------------------------------------------------------------------ */
/* Ícones                                                                   */
/* ------------------------------------------------------------------------ */

function IconDrop({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 2.5c3.2 4.4 7 9.1 7 13.2a7 7 0 1 1-14 0c0-4.1 3.8-8.8 7-13.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconSparkle({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 3c.6 3.6 2 5.4 5.6 6-3.6.6-5 2.4-5.6 6-.6-3.6-2-5.4-5.6-6 3.6-.6 5-2.4 5.6-6Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconShield({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 2.8 19.5 6v5.4c0 5-3.2 8.7-7.5 10.6-4.3-1.9-7.5-5.6-7.5-10.6V6L12 2.8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 12.2l2.1 2.1L15.3 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconTarget({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

function IconGem({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M5 9 8.5 4h7L19 9l-7 11L5 9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M5 9h14M9 9l3 11 3-11" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconBowl({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 11h16a8 8 0 0 1-16 0Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 11c0-2.2.9-4 2-4M15 11c0-2.2-.9-4-2-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconArrow({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M5 12h13M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------------ */
/* UI base                                                                   */
/* ------------------------------------------------------------------------ */

function Eyebrow({
  children,
  light = true,
}: {
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] ${
        light ? "text-[#E8C77E]" : "text-[#C08A34]"
      }`}
      style={{ fontFamily: "var(--font-utility)" }}
    >
      <IconDrop className="h-3 w-3" />
      {children}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  light?: boolean;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""} transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      {eyebrow && <Eyebrow light={light}>{eyebrow}</Eyebrow>}
      <h2
        className={`mt-3 text-3xl leading-[1.15] sm:text-4xl ${
          light ? "text-[#FBF7EF]" : "text-[#1C1410]"
        }`}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-base leading-relaxed ${
            light ? "text-[#FBF7EF]/70" : "text-[#1C1410]/65"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

function PrimaryButton({
  children,
  className = "",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      className={`group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#E8C77E] to-[#C08A34] px-7 py-3.5 text-sm font-semibold text-[#1C1410] shadow-[0_10px_30px_rgba(192,138,52,0.35)] transition-all duration-300 hover:shadow-[0_14px_36px_rgba(192,138,52,0.5)] hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8C77E] ${className}`}
    >
      {children}
    </a>
  );
}

function SecondaryButton({
  children,
  className = "",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-current px-7 py-3.5 text-sm font-semibold transition-all duration-300 hover:bg-[#1C1410]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C1410] ${className}`}
    >
      {children}
    </a>
  );
}

function MiniBottleIllustration() {
  return (
    <svg viewBox="0 0 160 200" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="miniOilGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F1D695" />
          <stop offset="55%" stopColor="#C08A34" />
          <stop offset="100%" stopColor="#8C651F" />
        </linearGradient>
      </defs>
      <path
        d="M57 30h46l7 17v10c11 13 17 29 17 50 0 37-23 59-46 59s-46-22-46-59c0-21 6-37 17-50V47l5-17Z"
        fill="rgba(251,247,239,0.08)"
        stroke="rgba(251,247,239,0.25)"
        strokeWidth="1.2"
      />
      <path
        d="M31 118c0-3 2-5 5-5h87c3 0 5 2 5 5 3 10 4.5 20 4.5 29 0 37-23 50-53 50s-53-13-53-50c0-9 1.5-19 4.5-29Z"
        fill="url(#miniOilGold)"
      />
      <rect x="63" y="13" width="34" height="15" rx="3" fill="#1C1410" />
      <rect x="60" y="26" width="40" height="7" rx="2" fill="#2A211B" />
    </svg>
  );
}

/* ------------------------------------------------------------------------ */
/* Hero                                                                     */
/* ------------------------------------------------------------------------ */

function Hero() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section className="relative overflow-hidden bg-[#1C1410] pb-24 pt-20 sm:pb-32 sm:pt-28">
      <div
        className="pointer-events-none absolute -left-32 top-16 h-72 w-72 rounded-full bg-[#C08A34]/20 blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#B5533C]/10 blur-[120px]"
        aria-hidden="true"
      />

      <div
        ref={ref}
        className={`relative mx-auto max-w-3xl px-6 text-center transition-all duration-700 ease-out ${
          visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <Eyebrow>Páginas de vendas para K-Beauty &amp; K-Food</Eyebrow>
        <h1
          className="mx-auto mt-5 max-w-2xl text-4xl leading-[1.1] text-[#FBF7EF] sm:text-5xl lg:text-[3.3rem]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Seu produto coreano merece uma{" "}
          <span className="italic text-[#E8C77E]">página de vendas</span> à
          altura da sua marca.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#FBF7EF]/70">
          Criamos páginas de vendas premium para empresas que vendem produtos de
          K-Beauty e K-Food, combinando design, experiência do usuário e
          estratégia de conversão.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <PrimaryButton href={CONTACT_HREF}>
            Criar minha página
            <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </PrimaryButton>
          <SecondaryButton href="#exemplos" className="text-[#FBF7EF]">
            Ver exemplos
          </SecondaryButton>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* Categorias                                                               */
/* ------------------------------------------------------------------------ */

const AUDIENCE = [
  {
    icon: IconSparkle,
    tag: "K-Beauty",
    title: "Marcas de beleza coreana",
    text: "Skincare, cabelo, maquiagem, cosméticos e cuidados pessoais. Transformamos o produto em uma experiência visual que comunica qualidade à primeira vista.",
    accent: "from-[#E8C77E] to-[#C08A34]",
  },
  {
    icon: IconBowl,
    tag: "K-Food",
    title: "Marcas de alimentos coreanos",
    text: "Alimentos, snacks, bebidas e ingredientes. Criamos páginas que despertam apetite e geram confiança para quem ainda não conhece o produto.",
    accent: "from-[#E0906F] to-[#B5533C]",
  },
];

function Audience() {
  return (
    <section className="bg-[#FBF7EF] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Para quem criamos"
          title="Duas categorias. Um mesmo padrão de qualidade."
          align="center"
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {AUDIENCE.map((a, i) => {
            const { ref, visible } = useReveal<HTMLDivElement>();
            const Icon = a.icon;
            return (
              <div
                key={a.tag}
                ref={ref}
                style={{ transitionDelay: `${i * 100}ms` }}
                className={`rounded-3xl border border-[#1C1410]/8 bg-white p-8 transition-all duration-700 ease-out ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-5 opacity-0"
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b text-[#1C1410] ${a.accent}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <span
                  className="mt-5 block text-[11px] font-bold uppercase tracking-[0.18em] text-[#1C1410]/40"
                  style={{ fontFamily: "var(--font-utility)" }}
                >
                  {a.tag}
                </span>
                <h3
                  className="mt-1 text-2xl text-[#1C1410]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {a.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#1C1410]/60">
                  {a.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* Lista de Páginas em Carrossel com Navegação (Anterior / Próximo)         */
/* ------------------------------------------------------------------------ */

function ListaDePages({ products = mockProducts }: { products?: Product[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const scrollPosition = container.scrollLeft;
    const itemWidth = container.clientWidth;
    const index = Math.round(scrollPosition / itemWidth);
    setCurrentIndex(index);
  };

  const scrollToIndex = (index: number) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const itemWidth = container.clientWidth;
    container.scrollTo({
      left: itemWidth * index,
      behavior: "smooth",
    });
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < products.length - 1) {
      scrollToIndex(currentIndex + 1);
    }
  };

  return (
    <section id="exemplos" className="bg-[#1C1410] py-24 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Exemplos reais do nosso trabalho"
          title="Nossos projetos e demonstrações de páginas de vendas."
          description="Navegue entre as demonstrações de páginas criadas para marcas de K-Beauty e K-Food."
          light
          align="center"
        />

        {/* Carrossel Wrapper */}
        <div className="relative mt-12 mx-auto max-w-4xl">
          {/* Track do Carrossel */}
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth scrollbar-none"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {products.map((product, index) => (
              <div
                key={product.id || index}
                className="w-full flex-shrink-0 snap-center px-1"
              >
                {/* Moldura do Browser */}
                <div className="overflow-hidden rounded-2xl border border-[#FBF7EF]/12 bg-[#15100C] shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
                  {/* Topbar do Browser */}
                  <div className="flex items-center gap-2 border-b border-[#FBF7EF]/10 bg-[#1C1410] px-4 py-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FBF7EF]/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FBF7EF]/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FBF7EF]/15" />
                    <span className="ml-3 truncate rounded-full bg-[#FBF7EF]/5 px-3 py-1 text-[11px] text-[#FBF7EF]/40">
                      suaempresa.com/produtos/{product.slug}
                    </span>
                  </div>

                  {/* Conteúdo do Card */}
                  <div className="grid gap-8 p-8 sm:grid-cols-[1fr_auto] sm:items-center sm:p-12">
                    <div className="text-left">
                      <span
                        className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#C08A34]"
                        style={{ fontFamily: "var(--font-utility)" }}
                      >
                        {product.category} · {product.subcategory}
                      </span>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.08em] text-[#FBF7EF]/35">
                        {product.brand}
                      </p>
                      <h3
                        className="mt-3 text-2xl leading-tight text-[#FBF7EF] sm:text-3xl"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {product.headline}
                        <br />
                        <span className="italic text-[#E8C77E]">
                          {product.description}
                        </span>
                      </h3>
                      <div className="mt-6">
                        <PrimaryButton
                          href={`/pagina-de-vendas/${product.slug}`}
                          className="px-6 py-3 text-xs"
                        >
                          Ver exemplo completo
                          <IconArrow className="h-3.5 w-3.5" />
                        </PrimaryButton>
                      </div>
                    </div>

                    <div className="mx-auto h-40 w-32 flex-shrink-0 sm:h-48 sm:w-36 product-image-wrapper relative">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <MiniBottleIllustration />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controles de Navegação (Setas e Paginação) */}
          {products.length > 1 && (
            <div className="mt-8 flex items-center justify-between px-2">
              {/* Botão Anterior */}
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                aria-label="Item anterior"
                className={`flex h-11 w-11 items-center justify-center rounded-full border border-[#FBF7EF]/15 bg-[#1C1410] text-[#FBF7EF] transition-all duration-300 hover:border-[#E8C77E] hover:bg-[#E8C77E]/10 disabled:opacity-30 disabled:hover:border-[#FBF7EF]/15 disabled:hover:bg-[#1C1410]`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5 rotate-180"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12h13M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Indicadores / Paginação */}
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-semibold text-[#FBF7EF]/50 tracking-wider"
                  style={{ fontFamily: "var(--font-utility)" }}
                >
                  {currentIndex + 1} / {products.length}
                </span>
              </div>

              {/* Botão Próximo */}
              <button
                onClick={handleNext}
                disabled={currentIndex === products.length - 1}
                aria-label="Próximo item"
                className={`flex h-11 w-11 items-center justify-center rounded-full border border-[#FBF7EF]/15 bg-[#1C1410] text-[#FBF7EF] transition-all duration-300 hover:border-[#E8C77E] hover:bg-[#E8C77E]/10 disabled:opacity-30 disabled:hover:border-[#FBF7EF]/15 disabled:hover:bg-[#1C1410]`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12h13M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* Benefícios                                                               */
/* ------------------------------------------------------------------------ */

const BENEFITS = [
  {
    icon: IconSparkle,
    title: "Mais valor percebido",
    text: "Apresente seus produtos com uma experiência visual profissional, à altura da marca que você construiu.",
  },
  {
    icon: IconShield,
    title: "Mais confiança",
    text: "Uma página bem construída transmite credibilidade imediata para quem ainda não conhece o seu produto.",
  },
  {
    icon: IconTarget,
    title: "Mais conversão",
    text: "Estruturamos a jornada do produto para facilitar a decisão de compra, do primeiro clique ao carrinho.",
  },
  {
    icon: IconGem,
    title: "Experiência premium",
    text: "Design pensado especificamente para valorizar produtos de K-Beauty e K-Food — não um modelo genérico.",
  },
];

function Benefits() {
  return (
    <section className="bg-[#FBF7EF] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Por que investir nisso"
          title="Por que sua empresa deveria ter uma página de vendas profissional."
          align="center"
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b, i) => {
            const { ref, visible } = useReveal<HTMLDivElement>();
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                ref={ref}
                style={{ transitionDelay: `${i * 90}ms` }}
                className={`group rounded-2xl bg-white p-7 shadow-[0_1px_0_rgba(28,20,16,0.06)] transition-all duration-700 ease-out hover:shadow-[0_20px_40px_rgba(28,20,16,0.08)] hover:-translate-y-1 ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-5 opacity-0"
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b from-[#E8C77E] to-[#C08A34] text-[#1C1410]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3
                  className="mt-5 text-lg text-[#1C1410]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {b.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#1C1410]/60">
                  {b.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* Como funciona                                                            */
/* ------------------------------------------------------------------------ */

const STEPS = [
  {
    n: "01",
    title: "Envie seu produto",
    text: "Você apresenta o produto e as informações da sua marca.",
  },
  {
    n: "02",
    title: "Criamos a página",
    text: "Desenvolvemos o design e a experiência de venda, do zero.",
  },
  {
    n: "03",
    title: "Publique e venda",
    text: "Sua empresa recebe uma página profissional pronta para apresentar o produto.",
  },
];

function HowItWorks() {
  return (
    <section className="bg-[#1C1410] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Como funciona"
          title="Um processo simples, do produto à página no ar."
          light
          align="center"
        />
        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {STEPS.map((s, i) => {
            const { ref, visible } = useReveal<HTMLDivElement>();
            return (
              <div
                key={s.n}
                ref={ref}
                style={{ transitionDelay: `${i * 120}ms` }}
                className={`relative text-center transition-all duration-700 ease-out ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-5 opacity-0"
                }`}
              >
                <span
                  className="text-5xl text-[#FBF7EF]/10"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.n}
                </span>
                <h3
                  className="-mt-3 text-xl text-[#FBF7EF]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.title}
                </h3>
                <p className="mx-auto mt-2 max-w-[16rem] text-sm leading-relaxed text-[#FBF7EF]/60">
                  {s.text}
                </p>
                {i < STEPS.length - 1 && (
                  <div className="mx-auto mt-6 hidden h-px w-full max-w-[6rem] bg-gradient-to-r from-[#C08A34]/40 to-transparent sm:block" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* CTA final                                                                */
/* ------------------------------------------------------------------------ */

function FinalCTA() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section
      id="contato"
      className="relative overflow-hidden bg-[#FBF7EF] py-28"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-[#C08A34]/15 blur-[110px]"
        aria-hidden="true"
      />
      <div
        ref={ref}
        className={`relative mx-auto max-w-2xl px-6 text-center transition-all duration-700 ease-out ${
          visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
        }`}
      >
        <h2
          className="text-4xl leading-tight text-[#1C1410] sm:text-5xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Seu produto merece uma página
          <br />
          <span className="italic text-[#C08A34]">que valorize sua marca.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-[#1C1410]/60">
          Criamos experiências de venda premium para empresas de K-Beauty e
          K-Food.
        </p>
        <div className="mt-9">
          <PrimaryButton href={CONTACT_HREF}>
            Criar minha página
            <IconArrow className="h-4 w-4" />
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* Página                                                                   */
/* ------------------------------------------------------------------------ */

export default function Page() {
  return (
    <div
      className={`${fraunces.variable} ${inter.variable} ${manrope.variable} bg-[#FBF7EF]`}
      style={{ fontFamily: "var(--font-body)" }}
    >
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }
        }
      `}</style>

      <main>
        <Hero />

        <Audience />
        <ListaDePages />
        <Benefits />
        <HowItWorks />
        <FinalCTA />
      </main>
    </div>
  );
}
