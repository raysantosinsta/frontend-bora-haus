'use client';

/**
 * Landing page — Óleo Extraordinário Elseve (L'Oréal Paris)
 * Next.js (App Router) · TypeScript · Tailwind CSS
 *
 * Direção de design
 * ------------------
 * Paleta "óleo dourado sobre madeira escura": espresso quase-preto (#1C1410) como
 * base de autoridade, marfim quente (#FBF7EF) para respiro, e um dourado de óleo
 * (#C08A34 → #E8C77E) como o único acento que se repete — nunca neon, nunca
 * gradiente decorativo sem função. Um rosé floral discreto (#C97B6D) aparece só
 * nos 6 óleos de flores, nunca como cor de marca.
 * Tipografia: Fraunces (serifada, com curvas quentes — casa com "óleo/flor/pele")
 * para display, Inter para corpo, Manrope caps para rótulos/eyebrows.
 * Assinatura visual: "a gota" — uma gota dourada que cai, se espalha e vira o fio
 * de continuidade da página (hero, indicadores do frasco, marcadores do "como
 * usar" — aqui sim uma sequência real de 3 passos).
 *
 * Observações de implementação
 * -----------------------------
 * - Sem dependências pesadas: reveal-on-scroll e contador animado são hooks
 *   próprios com IntersectionObserver, respeitando prefers-reduced-motion.
 * - Preço e nº de avaliações mudam com frequência na Amazon — os valores abaixo
 *   refletem a página do produto no momento da pesquisa; troque por dados vivos
 *   (ex.: Amazon PA-API ou atualização manual periódica) antes de publicar.
 * - Depoimentos individuais NÃO foram inventados — a seção de prova social usa
 *   apenas a nota agregada real e deixa um slot comentado para você inserir
 *   avaliações reais de clientes quando tiver.
 * - Fontes carregadas aqui via next/font para portabilidade deste arquivo único;
 *   em produção, mova o carregamento para app/layout.tsx se outras páginas
 *   também usarem essas famílias, para evitar duplicar o download da fonte.
 */

import { Fraunces, Inter, Manrope } from 'next/font/google';
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type ButtonHTMLAttributes,
  type AnchorHTMLAttributes,
} from 'react';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
});
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
});
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-utility',
});

const PRODUCT_URL =
  'https://www.amazon.com.br/Paris-Extraordin%C3%A1rio-Finalizador-Preciosos-Anti-Frizz/dp/B07H113TPQ/ref=zg_bs_c_beauty_d_sccl_1/144-0377399-3697239';

/* ------------------------------------------------------------------------ */
/* Hooks                                                                     */
/* ------------------------------------------------------------------------ */

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
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
      { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function useCountUp(target: number, decimals = 0, duration = 1400) {
  const { ref, visible } = useReveal<HTMLSpanElement>();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, target, duration]);

  return { ref, display: value.toFixed(decimals) };
}

/* ------------------------------------------------------------------------ */
/* Ícones (inline, leves, sem libs externas)                                */
/* ------------------------------------------------------------------------ */

function IconDrop({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 2.5c3.2 4.4 7 9.1 7 13.2a7 7 0 1 1-14 0c0-4.1 3.8-8.8 7-13.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconShield({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
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

function IconLeaf({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 19c8-1 12-6 12-14-8 0-13 4-14 12l2 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 17.5 15 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSparkle({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3c.6 3.6 2 5.4 5.6 6-3.6.6-5 2.4-5.6 6-.6-3.6-2-5.4-5.6-6 3.6-.6 5-2.4 5.6-6Z"
        fill="currentColor"
      />
      <path
        d="M19 15c.3 1.7.9 2.4 2.5 2.7-1.6.3-2.2 1-2.5 2.7-.3-1.7-.9-2.4-2.5-2.7 1.6-.3 2.2-1 2.5-2.7Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconFeather({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M20 4c-7 .5-13 4-15 16 8-1 13-5.5 15-16Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M5 19 15.5 8.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconClock({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 7.5V12l3 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCheck({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4.5 12.5 9.5 17.5 19.5 6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconChevron({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7 9.5 12 14.5 17 9.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------------ */
/* Ilustração assinatura — o frasco e a gota                                */
/* ------------------------------------------------------------------------ */

function BottleIllustration() {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-sm select-none">
      <svg
        viewBox="0 0 320 400"
        className="h-full w-full drop-shadow-[0_30px_60px_rgba(28,20,16,0.45)]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="oilGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F1D695" />
            <stop offset="55%" stopColor="#C08A34" />
            <stop offset="100%" stopColor="#8C651F" />
          </linearGradient>
          <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(251,247,239,0.14)" />
            <stop offset="100%" stopColor="rgba(251,247,239,0.02)" />
          </linearGradient>
        </defs>

        {/* corpo do frasco */}
        <path
          d="M115 60h90l14 34v20c22 26 34 58 34 100 0 74-46 118-92 118s-92-44-92-118c0-42 12-74 34-100V94l12-34Z"
          fill="url(#glass)"
          stroke="rgba(251,247,239,0.35)"
          strokeWidth="1.5"
        />

        {/* nível de óleo (anima a "respirar" suavemente) */}
        <g className="animate-oil-breathe" style={{ transformOrigin: '160px 300px' }}>
          <path
            d="M63 236c0-6 4-10 10-10h174c6 0 10 4 10 10 6 20 9 40 9 58 0 74-46 100-106 100s-106-26-106-100c0-18 3-38 9-58Z"
            fill="url(#oilGold)"
          />
        </g>

        {/* linha da tampa */}
        <rect x="126" y="26" width="68" height="30" rx="6" fill="#1C1410" />
        <rect x="120" y="52" width="80" height="14" rx="4" fill="#2A211B" />

        {/* rótulo */}
        <rect
          x="96"
          y="176"
          width="128"
          height="66"
          rx="4"
          fill="rgba(251,247,239,0.92)"
        />
        <text
          x="160"
          y="202"
          textAnchor="middle"
          fontFamily="var(--font-display)"
          fontSize="15"
          fill="#1C1410"
        >
          Extraordinaire
        </text>
        <text
          x="160"
          y="220"
          textAnchor="middle"
          fontFamily="var(--font-utility)"
          fontSize="8"
          letterSpacing="2"
          fill="#8C651F"
        >
          6 ÓLEOS PRECIOSOS
        </text>
        <text
          x="160"
          y="233"
          textAnchor="middle"
          fontFamily="var(--font-utility)"
          fontSize="7"
          letterSpacing="1.5"
          fill="#5c4a34"
        >
          ANTI-FRIZZ · 100ML
        </text>
      </svg>

      {/* gotas flutuantes — a assinatura da página */}
      <div className="pointer-events-none absolute -right-2 top-6 text-[#E8C77E] animate-float-slow">
        <IconDrop className="h-6 w-6 drop-shadow-[0_6px_10px_rgba(192,138,52,0.5)]" />
      </div>
      <div className="pointer-events-none absolute -left-4 top-1/3 text-[#C08A34] animate-float-slower">
        <IconDrop className="h-4 w-4 opacity-80" />
      </div>
      <div className="pointer-events-none absolute bottom-8 right-4 text-[#E8C77E] animate-float-slow">
        <IconDrop className="h-3.5 w-3.5 opacity-70" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* UI base                                                                   */
/* ------------------------------------------------------------------------ */

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#C08A34]"
      style={{ fontFamily: 'var(--font-utility)' }}
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
  align = 'left',
  light = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  light?: boolean;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''} transition-all duration-700 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2
        className={`mt-3 text-3xl leading-[1.15] sm:text-4xl ${
          light ? 'text-[#FBF7EF]' : 'text-[#1C1410]'
        }`}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-base leading-relaxed ${
            light ? 'text-[#FBF7EF]/70' : 'text-[#1C1410]/65'
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
  className = '',
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
  className = '',
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

/* ------------------------------------------------------------------------ */
/* Header                                                                    */
/* ------------------------------------------------------------------------ */

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#FBF7EF]/10 bg-[#1C1410]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span
          className="text-lg tracking-wide text-[#FBF7EF]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Extraordinaire<span className="text-[#E8C77E]">.</span>
        </span>
        <nav className="hidden items-center gap-8 text-sm text-[#FBF7EF]/70 md:flex">
          <a href="#como-funciona" className="hover:text-[#FBF7EF]">
            Como usar
          </a>
          <a href="#diferenciais" className="hover:text-[#FBF7EF]">
            Diferenciais
          </a>
          <a href="#avaliacoes" className="hover:text-[#FBF7EF]">
            Avaliações
          </a>
          <a href="#faq" className="hover:text-[#FBF7EF]">
            Dúvidas
          </a>
        </nav>
        <PrimaryButton
          href={PRODUCT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 text-xs"
        >
          Comprar agora
        </PrimaryButton>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------------ */
/* Hero                                                                      */
/* ------------------------------------------------------------------------ */

function Hero() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section className="relative overflow-hidden bg-[#1C1410] pb-24 pt-40 sm:pb-32 sm:pt-48">
      <div
        className="pointer-events-none absolute -left-32 top-16 h-72 w-72 rounded-full bg-[#C08A34]/20 blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#C97B6D]/10 blur-[120px]"
        aria-hidden="true"
      />

      <div
        ref={ref}
        className="relative mx-auto grid max-w-6xl items-center gap-16 px-6 lg:grid-cols-2"
      >
        <div
          className={`transition-all duration-700 ease-out ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <Eyebrow>L&apos;Oréal Paris · Elseve</Eyebrow>
          <h1
            className="mt-5 text-4xl leading-[1.08] text-[#FBF7EF] sm:text-5xl lg:text-[3.4rem]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            6 óleos preciosos.
            <br />
            <span className="italic text-[#E8C77E]">Um único gesto.</span>
            <br />
            Brilho que dura o dia inteiro.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-[#FBF7EF]/70">
            O Óleo Extraordinário Elseve é o leave-in que trata a fibra por
            dentro: nutre, disciplina o frizz e protege até 230°C do calor da
            chapinha — sem pesar, sem untar, sem enxágue.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <PrimaryButton
              href={PRODUCT_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Quero meu Óleo Extraordinário
              <IconChevron className="h-4 w-4 -rotate-90 transition-transform group-hover:translate-x-0.5" />
            </PrimaryButton>
            <SecondaryButton href="#como-funciona" className="text-[#FBF7EF]">
              Ver como funciona
            </SecondaryButton>
          </div>

          <p className="mt-5 text-xs uppercase tracking-[0.14em] text-[#FBF7EF]/40">
            Frete grátis acima de R$129 · Compra 100% segura na Amazon
          </p>
        </div>

        <div
          className={`transition-all delay-150 duration-700 ease-out ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <BottleIllustration />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* Barra de confiança                                                        */
/* ------------------------------------------------------------------------ */

function TrustBar() {
  const rating = useCountUp(4.8, 1);
  const reviews = useCountUp(71, 0);
  const heat = useCountUp(230, 0);
  const oils = useCountUp(6, 0);

  const stats: { display: string; ref: any; label: string }[] = [
    { display: `${rating.display}★`, ref: rating.ref, label: 'nota média na Amazon' },
    { display: `+${reviews.display} mil`, ref: reviews.ref, label: 'avaliações de clientes' },
    { display: `${heat.display}°C`, ref: heat.ref, label: 'proteção térmica' },
    { display: oils.display, ref: oils.ref, label: 'óleos de flores preciosas' },
  ];

  return (
    <section className="border-y border-[#1C1410]/8 bg-[#F3ECDD]">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-10 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <span
              ref={s.ref}
              className="block text-3xl text-[#1C1410] sm:text-4xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {s.display}
            </span>
            <span className="mt-1 block text-xs uppercase tracking-[0.1em] text-[#1C1410]/50">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* Problema                                                                  */
/* ------------------------------------------------------------------------ */

const PROBLEMS = [
  {
    icon: IconShield,
    title: 'Chapinha e secador sem proteção de verdade',
    text: 'O calor repetido resseca e enfraquece a fibra capilar, mesmo com produtos que prometem "proteção térmica".',
  },
  {
    icon: IconFeather,
    title: 'Óleos que pesam e untam a raiz',
    text: 'Fórmulas densas deixam o cabelo com aparência de sujo horas depois da aplicação, principalmente em fios finos.',
  },
  {
    icon: IconSparkle,
    title: 'Frizz que volta em minutos',
    text: 'Em dias úmidos, o efeito de produtos que só "disfarçam" o frizz na superfície some antes mesmo de sair de casa.',
  },
  {
    icon: IconClock,
    title: 'Pontas duplas que não somem',
    text: 'Hidratação comum trata a superfície, mas não repõe o que a fibra perde com química, sol e escova quente.',
  },
];

function ProblemSection() {
  return (
    <section className="bg-[#FBF7EF] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="O problema"
          title="Ainda lutando contra o frizz todos os dias?"
          description="Se alguma dessas situações é rotina no seu banheiro, o problema não é o seu cabelo — é o produto errado para o que ele precisa."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROBLEMS.map((p, i) => {
            const { ref, visible } = useReveal<HTMLDivElement>();
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                ref={ref}
                style={{ transitionDelay: `${i * 90}ms` }}
                className={`rounded-2xl border border-[#1C1410]/8 bg-white/60 p-6 transition-all duration-700 ease-out ${
                  visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                }`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1C1410] text-[#E8C77E]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3
                  className="mt-4 text-lg text-[#1C1410]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#1C1410]/60">
                  {p.text}
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
/* Solução                                                                   */
/* ------------------------------------------------------------------------ */

function SolutionSection() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const steps = [
    { label: 'Problema', value: 'Frizz, ressecamento e fios pesados' },
    { label: 'Óleo Extraordinário', value: '6 óleos de flores preciosas, fórmula leve' },
    { label: 'Resultado', value: 'Brilho, maciez e frizz sob controle' },
  ];
  return (
    <section className="bg-[#1C1410] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="A solução"
          title="Existe uma maneira melhor de tratar o fio."
          description="Em vez de disfarçar o frizz na superfície, o Óleo Extraordinário penetra as fibras capilares e trata de dentro para fora — leve o suficiente para não pesar, forte o suficiente para proteger do calor."
          light
        />
        <div
          ref={ref}
          className={`mt-14 grid gap-4 sm:grid-cols-3 transition-all duration-700 ease-out ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}
        >
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center gap-4">
              <div className="flex-1 rounded-2xl border border-[#FBF7EF]/12 bg-[#FBF7EF]/[0.04] p-6">
                <span
                  className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#E8C77E]"
                  style={{ fontFamily: 'var(--font-utility)' }}
                >
                  {s.label}
                </span>
                <p className="mt-2 text-[#FBF7EF]/85">{s.value}</p>
              </div>
              {i < steps.length - 1 && (
                <IconChevron className="hidden h-5 w-5 -rotate-90 text-[#E8C77E]/60 sm:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* Benefícios                                                                */
/* ------------------------------------------------------------------------ */

const BENEFITS = [
  {
    icon: IconSparkle,
    title: 'Brilho instantâneo',
    text: 'Fios com aspecto saudável e luminoso já na primeira aplicação, sem efeito de produto na superfície.',
  },
  {
    icon: IconFeather,
    title: 'Leve, sem pesar',
    text: 'Fórmula não gordurosa que se adapta a todos os tipos de cabelo — do fino ao cacheado.',
  },
  {
    icon: IconShield,
    title: 'Proteção térmica até 230°C',
    text: 'Uma camada de proteção antes da chapinha, do secador ou da babyliss.',
  },
  {
    icon: IconLeaf,
    title: 'Nutrição profunda',
    text: '6 óleos de flores preciosas penetram a fibra capilar para tratar, não só cobrir.',
  },
];

function Benefits() {
  return (
    <section className="bg-[#FBF7EF] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Benefícios"
          title="O que muda no seu cabelo, na prática."
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
                  visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b from-[#E8C77E] to-[#C08A34] text-[#1C1410]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3
                  className="mt-5 text-lg text-[#1C1410]"
                  style={{ fontFamily: 'var(--font-display)' }}
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
/* Demonstração do produto                                                   */
/* ------------------------------------------------------------------------ */

function ProductShowcase() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const callouts = [
    { top: '18%', left: '8%', text: 'Fórmula leve, não gordurosa' },
    { top: '46%', left: '86%', text: 'Protege até 230°C' },
    { top: '78%', left: '10%', text: '3 a 4 pressões por aplicação' },
  ];
  return (
    <section className="bg-[#1C1410] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="O produto em ação"
          title="100ml pensados para durar meses de uso real."
          description="Um frasco compacto, com válvula dosadora, feito para caber na rotina — do banheiro à bolsa."
          light
          align="center"
        />
        <div
          ref={ref}
          className={`relative mx-auto mt-14 max-w-lg transition-all duration-700 ease-out ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}
        >
          <BottleIllustration />
          {callouts.map((c) => (
            <div
              key={c.text}
              className="absolute hidden max-w-[9.5rem] items-center gap-2 rounded-full border border-[#FBF7EF]/15 bg-[#1C1410]/80 px-3 py-2 text-xs text-[#FBF7EF]/90 backdrop-blur-sm sm:flex"
              style={{ top: c.top, left: c.left }}
            >
              <IconDrop className="h-3 w-3 flex-shrink-0 text-[#E8C77E]" />
              {c.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* Como funciona                                                             */
/* ------------------------------------------------------------------------ */

const STEPS = [
  {
    n: '01',
    title: 'Aplique',
    text: '3 a 4 pressões nas mãos, em cabelos molhados ou secos.',
  },
  {
    n: '02',
    title: 'Distribua',
    text: 'Passe da metade às pontas — evite a raiz para não pesar.',
  },
  {
    n: '03',
    title: 'Finalize',
    text: 'Penteie, seque ou modele normalmente. É só isso.',
  },
];

function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-[#FBF7EF] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Como usar"
          title="Três passos. Nenhum enxágue."
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
                  visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                }`}
              >
                <span
                  className="text-5xl text-[#1C1410]/10"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {s.n}
                </span>
                <h3
                  className="-mt-3 text-xl text-[#1C1410]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {s.title}
                </h3>
                <p className="mx-auto mt-2 max-w-[16rem] text-sm leading-relaxed text-[#1C1410]/60">
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
/* Diferenciais                                                              */
/* ------------------------------------------------------------------------ */

const DIFFERENTIALS = [
  {
    trad: 'Séruns comuns disfarçam o frizz na superfície',
    ours: 'Trata a fibra com 6 óleos de flores preciosas',
  },
  {
    trad: 'Fórmulas densas que oleiam a raiz',
    ours: 'Leve e não gordurosa, sem pesar',
  },
  {
    trad: 'Sem proteção térmica real',
    ours: 'Protege até 230°C do calor da chapinha',
  },
  {
    trad: 'Uma fórmula genérica para "todo mundo"',
    ours: 'Se adapta a todos os tipos de cabelo',
  },
];

function Differentials() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section id="diferenciais" className="bg-[#1C1410] py-24">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeading
          eyebrow="Diferenciais"
          title="Por que trocar o que você já usa."
          light
          align="center"
        />
        <div
          ref={ref}
          className={`mt-14 overflow-hidden rounded-2xl border border-[#FBF7EF]/10 transition-all duration-700 ease-out ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}
        >
          <div
            className="grid grid-cols-2 border-b border-[#FBF7EF]/10 text-[11px] font-bold uppercase tracking-[0.14em]"
            style={{ fontFamily: 'var(--font-utility)' }}
          >
            <div className="bg-[#FBF7EF]/[0.03] px-6 py-4 text-[#FBF7EF]/45">
              Método tradicional
            </div>
            <div className="bg-[#C08A34]/10 px-6 py-4 text-[#E8C77E]">
              Óleo Extraordinário
            </div>
          </div>
          {DIFFERENTIALS.map((d) => (
            <div
              key={d.trad}
              className="grid grid-cols-2 border-b border-[#FBF7EF]/8 text-sm last:border-b-0"
            >
              <div className="px-6 py-5 text-[#FBF7EF]/45">{d.trad}</div>
              <div className="flex items-start gap-2 bg-[#FBF7EF]/[0.02] px-6 py-5 text-[#FBF7EF]/90">
                <IconCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#E8C77E]" />
                {d.ours}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* Prova social                                                              */
/* ------------------------------------------------------------------------ */

function SocialProof() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section id="avaliacoes" className="bg-[#FBF7EF] py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <SectionHeading
          eyebrow="Prova social"
          title="Uma das notas mais altas em cuidados capilares na Amazon."
          align="center"
        />
        <div
          ref={ref}
          className={`mt-12 inline-flex flex-col items-center gap-3 rounded-3xl border border-[#1C1410]/8 bg-white px-12 py-10 shadow-[0_20px_60px_rgba(28,20,16,0.06)] transition-all duration-700 ease-out ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}
        >
          <span
            className="text-6xl text-[#1C1410]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            4,8<span className="text-2xl text-[#C08A34]">/5</span>
          </span>
          <div className="flex gap-1 text-[#E8C77E]">
            {Array.from({ length: 5 }).map((_, i) => (
              <IconSparkle key={i} className="h-4 w-4" />
            ))}
          </div>
          <p className="text-sm text-[#1C1410]/55">
            Mais de 71 mil avaliações de clientes na Amazon Brasil
          </p>
          <a
            href={PRODUCT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-sm font-semibold text-[#C08A34] underline-offset-4 hover:underline"
          >
            Ler avaliações na Amazon →
          </a>
        </div>

        {/*
          Slot para depoimentos reais de clientes.
          Não inserimos citações fictícias aqui — troque este bloco por
          avaliações reais (com autorização) assim que tiver.
          Sugestão de shape:
          { name: string; role?: string; quote: string; result?: string }
        */}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* Caso de uso / resultado                                                   */
/* ------------------------------------------------------------------------ */

function CaseStudy() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section className="bg-[#1C1410] py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div
          ref={ref}
          className={`grid gap-10 rounded-3xl border border-[#FBF7EF]/10 bg-[#FBF7EF]/[0.03] p-10 sm:grid-cols-2 sm:p-14 transition-all duration-700 ease-out ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}
        >
          <div>
            <Eyebrow>Resultado desde a 1ª aplicação</Eyebrow>
            <h3
              className="mt-4 text-3xl leading-tight text-[#FBF7EF]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              2x mais nutrição já no primeiro uso.
            </h3>
            <p className="mt-4 text-[#FBF7EF]/65">
              A combinação de 6 óleos de flores preciosas foi formulada para
              hidratar até os fios mais secos — sem esperar semanas de
              tratamento para sentir a diferença.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 self-center">
            <div className="rounded-2xl border border-[#FBF7EF]/10 p-6 text-center">
              <span
                className="block text-3xl text-[#E8C77E]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                2x
              </span>
              <span className="mt-1 block text-xs text-[#FBF7EF]/50">
                mais nutrição
              </span>
            </div>
            <div className="rounded-2xl border border-[#FBF7EF]/10 p-6 text-center">
              <span
                className="block text-3xl text-[#E8C77E]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                230°C
              </span>
              <span className="mt-1 block text-xs text-[#FBF7EF]/50">
                proteção térmica
              </span>
            </div>
            <div className="rounded-2xl border border-[#FBF7EF]/10 p-6 text-center">
              <span
                className="block text-3xl text-[#E8C77E]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                6
              </span>
              <span className="mt-1 block text-xs text-[#FBF7EF]/50">
                óleos preciosos
              </span>
            </div>
            <div className="rounded-2xl border border-[#FBF7EF]/10 p-6 text-center">
              <span
                className="block text-3xl text-[#E8C77E]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                100ml
              </span>
              <span className="mt-1 block text-xs text-[#FBF7EF]/50">
                por vários meses
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* Pricing                                                                   */
/* ------------------------------------------------------------------------ */

function Pricing() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const features = [
    'Frasco de 100ml com válvula dosadora',
    '6 óleos de flores preciosas',
    'Proteção térmica até 230°C',
    'Leave-in, sem necessidade de enxágue',
    'Compatível com todos os tipos de cabelo',
  ];
  return (
    <section className="bg-[#FBF7EF] py-24">
      <div className="mx-auto max-w-md px-6">
        <SectionHeading
          eyebrow="Onde comprar"
          title="Um frasco. Meses de cabelo tratado."
          align="center"
        />
        <div
          ref={ref}
          className={`mt-10 rounded-3xl border border-[#C08A34]/25 bg-white p-8 shadow-[0_30px_60px_rgba(28,20,16,0.08)] transition-all duration-700 ease-out ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}
        >
          <span className="inline-block rounded-full bg-[#C08A34]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-[#C08A34]">
            Escolha da Amazon
          </span>
          <div className="mt-4 flex items-baseline gap-2">
            <span
              className="text-4xl text-[#1C1410]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              R$ 34,90
            </span>
            <span className="text-sm text-[#1C1410]/45">/ 100ml</span>
          </div>
          <p className="mt-1 text-xs text-[#1C1410]/40">
            Preço aproximado — confira o valor atual na Amazon antes de
            finalizar a compra.
          </p>
          <ul className="mt-6 space-y-3">
            {features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2.5 text-sm text-[#1C1410]/70"
              >
                <IconCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#C08A34]" />
                {f}
              </li>
            ))}
          </ul>
          <PrimaryButton
            href={PRODUCT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 w-full"
          >
            Comprar na Amazon
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* FAQ                                                                       */
/* ------------------------------------------------------------------------ */

const FAQ_ITEMS = [
  {
    q: 'Serve para qualquer tipo de cabelo?',
    a: 'Sim. A fórmula leve e não gordurosa foi desenvolvida para se adaptar a fios lisos, ondulados, cacheados e crespos, sem pesar em nenhum deles.',
  },
  {
    q: 'Preciso enxaguar depois de aplicar?',
    a: 'Não. É um leave-in — aplique e siga com a rotina normal, seja secando, penteando ou deixando secar naturalmente.',
  },
  {
    q: 'Posso usar antes da chapinha ou do secador?',
    a: 'Sim, essa é uma das principais funções: aplicado antes do calor, oferece proteção térmica de até 230°C.',
  },
  {
    q: 'O óleo deixa o cabelo oleoso?',
    a: 'Não quando usado na quantidade recomendada (3 a 4 pressões) e aplicado da metade às pontas, evitando a raiz.',
  },
  {
    q: 'Quanto tempo dura o frasco de 100ml?',
    a: 'Com uso regular (algumas vezes por semana), a maioria das pessoas relata meses de uso a partir de um único frasco.',
  },
  {
    q: 'É livre de ftalatos?',
    a: 'Sim, de acordo com as informações do fabricante o produto é formulado sem ftalatos.',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#1C1410]/8 py-5">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C08A34]"
      >
        <span className="text-base font-medium text-[#1C1410]">{q}</span>
        <IconChevron
          className={`h-5 w-5 flex-shrink-0 text-[#C08A34] transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="pt-3 pr-8 text-sm leading-relaxed text-[#1C1410]/60">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

function FAQ() {
  return (
    <section id="faq" className="bg-[#FBF7EF] py-24">
      <div className="mx-auto max-w-2xl px-6">
        <SectionHeading eyebrow="Dúvidas frequentes" title="Perguntas antes de comprar." />
        <div className="mt-10">
          {FAQ_ITEMS.map((item) => (
            <FAQItem key={item.q} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* CTA final                                                                 */
/* ------------------------------------------------------------------------ */

function FinalCTA() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section className="relative overflow-hidden bg-[#1C1410] py-28">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-[#C08A34]/20 blur-[110px]"
        aria-hidden="true"
      />
      <div
        ref={ref}
        className={`relative mx-auto max-w-2xl px-6 text-center transition-all duration-700 ease-out ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
        }`}
      >
        <h2
          className="text-4xl leading-tight text-[#FBF7EF] sm:text-5xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Pronta para dar aos seus fios{' '}
          <span className="italic text-[#E8C77E]">o brilho que eles pedem?</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-[#FBF7EF]/65">
          Menos de um minuto por aplicação. Frisos sob controle o dia
          inteiro, sem pesar.
        </p>
        <div className="mt-9">
          <PrimaryButton
            href={PRODUCT_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Comprar agora na Amazon
          </PrimaryButton>
        </div>
        <p className="mt-4 text-xs uppercase tracking-[0.14em] text-[#FBF7EF]/35">
          Compra em poucos minutos · Entrega rastreada
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* Footer                                                                    */
/* ------------------------------------------------------------------------ */

function Footer() {
  const columns = [
    { title: 'Produto', links: ['Como usar', 'Diferenciais', 'Perguntas'] },
    { title: 'Marca', links: ["L'Oréal Paris", 'Linha Elseve'] },
    { title: 'Suporte', links: ['Fale conosco', 'Trocas e devoluções'] },
  ];
  return (
    <footer className="bg-[#15100C] py-16 text-[#FBF7EF]/50">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span
              className="text-lg text-[#FBF7EF]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Extraordinaire<span className="text-[#E8C77E]">.</span>
            </span>
            <p className="mt-3 max-w-[16rem] text-sm">
              Página não oficial de apresentação do produto Óleo
              Extraordinário Elseve, da L&apos;Oréal Paris.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#FBF7EF]/70">
                {col.title}
              </span>
              <ul className="mt-4 space-y-2 text-sm">
                {col.links.map((l) => (
                  <li key={l}>
                    <span className="cursor-pointer hover:text-[#FBF7EF]">
                      {l}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-[#FBF7EF]/10 pt-8 text-xs sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Extraordinaire. Todos os direitos reservados.</span>
          <div className="flex gap-6">
            <span className="cursor-pointer hover:text-[#FBF7EF]">Termos</span>
            <span className="cursor-pointer hover:text-[#FBF7EF]">Privacidade</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------------ */
/* Página                                                                    */
/* ------------------------------------------------------------------------ */

export default function Page() {
  return (
    <div
      className={`${fraunces.variable} ${inter.variable} ${manrope.variable} bg-[#FBF7EF]`}
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
          scroll-padding-top: 88px;
        }

        @keyframes oil-breathe {
          0%,
          100% {
            transform: scaleY(1) translateY(0);
          }
          50% {
            transform: scaleY(1.015) translateY(-2px);
          }
        }
        .animate-oil-breathe {
          animation: oil-breathe 6s ease-in-out infinite;
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float-slow {
          animation: float-slow 5s ease-in-out infinite;
        }

        @keyframes float-slower {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-14px);
          }
        }
        .animate-float-slower {
          animation: float-slower 7s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-oil-breathe,
          .animate-float-slow,
          .animate-float-slower {
            animation: none !important;
          }
          html {
            scroll-behavior: auto;
          }
        }
      `}</style>

      <Header />
      <main>
        <Hero />
        <TrustBar />
        <ProblemSection />
        <SolutionSection />
        <Benefits />
        <ProductShowcase />
        <HowItWorks />
        <Differentials />
        <SocialProof />
        <CaseStudy />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}