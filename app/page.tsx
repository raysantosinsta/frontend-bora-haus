"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Montserrat, Open_Sans } from "next/font/google";
import {
  ShieldCheck,
  Truck,
  Package,
  Sparkles,
  Flame,
  ArrowRight,
  Star,
  Clock,
  CheckCircle2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { fetchProducts } from "./lib/api";

// ============================================================
// 1. FONTES (via next/font)
// ============================================================
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-open-sans",
  display: "swap",
});

// ============================================================
// 2. INTERFACE (com images)
// ============================================================
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number | null;
  type: "digital" | "affiliate";
  affiliate_url: string;
  image_path: string;
  image_url: string; // capa (primeira imagem)
  images: string[]; // array com todas as URLs das imagens
  clicks_total: number;
  created_at: string;
}

interface Group {
  name: string;
  logoText: string;
  color: string;
}

// ============================================================
// 3. ANIMAÇÕES CSS
// ============================================================
const animations = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes pulseSoft {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  .animate-fade-in-up {
    animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
  }
  .animate-pulse-soft {
    animation: pulseSoft 3s ease-in-out infinite;
  }
  .delay-100 { animation-delay: 0.1s; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-300 { animation-delay: 0.3s; }
  .delay-400 { animation-delay: 0.4s; }
  .delay-500 { animation-delay: 0.5s; }
`;

const testimonials = [
  {
    name: "Mariana S.",
    group: "Stray Kids Stan",
    text: "Comprei meu álbum pelo link da Amazon e chegou em 3 dias! Embalagem perfeita, com plástico bolha e cantos intactos. Loja super confiável, recomendo demais!",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Beatriz L.",
    group: "BTS Stan",
    text: "Baixei o pack de wallpapers digitais do BTS e a qualidade é incrível! O download foi imediato e os arquivos são lindos. Valeu cada centavo, site muito seguro.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Camila R.",
    group: "NewJeans Stan",
    text: "Sempre compro aqui, seja físico ou digital. Os preços são justos, a entrega é rastreada e os produtos digitais chegam na hora. Confio de olhos fechados!",
    image:
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Lucas M.",
    group: "ATEEZ Stan",
    text: "Comprei um lightstick pela Amazon e veio lacrado, com nota fiscal e tudo. Rastreio funcionou perfeitamente. Não tive nenhum problema, loja 100% confiável.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Jéssica A.",
    group: "TWICE Stan",
    text: "Os produtos digitais (ícones, wallpapers e planners) são de altíssima qualidade. Já baixei várias vezes e sempre funciona. Recomendo a todos os fãs!",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Rafael O.",
    group: "SEVENTEEN Stan",
    text: "Fiquei com medo de comprar pela primeira vez, mas a Amazon fez a mediação e o produto chegou perfeitamente. Agora só compro aqui, confiança total.",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Ana P.",
    group: "BLACKPINK Stan",
    text: "Comprei o pack digital de pôsteres e veio com resolução 4K! Usei no meu celular e ficou lindo. Site seguro, pagamento via Pix e recebi na hora.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Gustavo H.",
    group: "BTS Stan",
    text: "Amazon entregou antes do prazo! O álbum veio com o POB exclusivo e sem nenhum amassado. Melhor experiência de compra que já tive.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Larissa F.",
    group: "Stray Kids Stan",
    text: "Produto digital do SKZ (planner 2026) chegou em minutos! Super organizado, com vários templates. Valeu cada real, vou comprar mais.",
    image:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Diego C.",
    group: "NewJeans Stan",
    text: "Primeira compra internacional e deu tudo certo! A Amazon garantiu a entrega e o vendedor enviou com nota. Loja confiável demais, nota 10.",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Patrícia R.",
    group: "TWICE Stan",
    text: "Adorei o sistema de rastreio – atualizava passo a passo. Produto original, embalagem reforçada. Já indiquei para todo o meu fandom!",
    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=150&h=150&fit=crop&crop=face",
  },
];

// ============================================================
// 4. COMPONENTE PRINCIPAL
// ============================================================
export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Índice do slide principal (entre produtos)
  const [currentSlide, setCurrentSlide] = useState(0);

  // Índice da imagem interna de cada produto (chave = productId, valor = índice)
  const [productImageIndexes, setProductImageIndexes] = useState<
    Record<string, number>
  >({});

  // Índice do carrossel de depoimentos
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const [timeLeft, setTimeLeft] = useState({
    hours: 47,
    minutes: 32,
    seconds: 15,
  });

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts();
        setProducts(data);
        // Inicializar índices de imagem para cada produto
        const initialIndexes: Record<string, number> = {};
        data.forEach((p) => {
          initialIndexes[p.id] = 0;
        });
        setProductImageIndexes(initialIndexes);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0)
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0)
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filtro para a seção de Comebacks (descrição contém "comebacks" ou "pré-vendas")
  const comebackProducts = products.filter((p) => {
    const desc = p.description?.toLowerCase() || "";
    return desc.includes("comebacks") || desc.includes("pré-vendas");
  });

  // 10 primeiros produtos para o carrossel do Hero
  const heroProducts = products.slice(0, 10);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroProducts.length) % heroProducts.length,
    );
  };

  // Funções para navegar nas imagens internas de um produto
  const changeProductImage = (productId: string, newIndex: number) => {
    setProductImageIndexes((prev) => ({
      ...prev,
      [productId]: newIndex,
    }));
  };

  const getCurrentImageIndex = (productId: string): number => {
    return productImageIndexes[productId] || 0;
  };

  const groups: Group[] = [
    { name: "BTS", logoText: "BTS", color: "from-purple-900 to-indigo-900" },
    { name: "Stray Kids", logoText: "SKZ", color: "from-red-900 to-zinc-900" },
    {
      name: "BLACKPINK",
      logoText: "BP",
      color: "from-pink-900 to-neutral-900",
    },
    { name: "NewJeans", logoText: "NJ", color: "from-blue-900 to-cyan-900" },
    { name: "SEVENTEEN", logoText: "SVT", color: "from-sky-900 to-blue-950" },
    { name: "TWICE", logoText: "TW", color: "from-orange-900 to-amber-950" },
  ];

  const handleAffiliateClick = (product: Product) => {
    console.log(`Redirecionando para produto ID: ${product.id}`);
    if (product.affiliate_url) {
      window.open(product.affiliate_url, "_blank");
    }
  };

  return (
    <>
      <style>{animations}</style>

      <div
        className={`min-h-screen bg-zinc-950 text-zinc-100 selection:bg-pink-600 selection:text-white ${montserrat.variable} ${openSans.variable}`}
        style={{ fontFamily: "var(--font-open-sans)" }}
      >
        {/* ============================================================
            1. HERO – Vídeo + Carrossel com imagens múltiplas por produto
            ============================================================ */}
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Vídeo de fundo */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
            poster="/foto.png"
          >
            <source src="/video.mp4" type="video/mp4" />
            <img
              src="/foto.png"
              alt="K-pop"
              className="w-full h-full object-cover"
            />
          </video>

          {/* Overlay escuro sutil */}
          <div className="absolute inset-0 bg-black/40 z-10" />

          {/* Carrossel centralizado */}
          <div className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6">
            {!loading && heroProducts.length > 0 ? (
              <div className="relative">
                <div className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-6 md:p-8">
                  <div
                    className="flex transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {heroProducts.map((product) => {
                      // Garantir que images seja um array válido
                      const rawImages =
                        product.images && product.images.length > 0
                          ? product.images
                          : [product.image_url].filter(Boolean);

                      // Se ainda estiver vazio, usar placeholder
                      const productImages =
                        rawImages.length > 0 ? rawImages : ["/placeholder.png"];

                      const currentImgIndex = getCurrentImageIndex(product.id);
                      // Garantir que o índice esteja dentro do array
                      const safeIndex = Math.min(
                        currentImgIndex,
                        productImages.length - 1,
                      );
                      const currentImage =
                        productImages[safeIndex] ||
                        productImages[0] ||
                        "/placeholder.png";

                      return (
                        <div
                          key={product.id}
                          className="min-w-full flex justify-center items-center px-4"
                        >
                          <div
                            key={product.id}
                            className="min-w-full flex justify-center items-center px-4"
                          >
                            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 w-full max-w-3xl mx-auto">
                              {/* Imagem do produto com carrossel interno */}
                              <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-2xl overflow-hidden flex-shrink-0 bg-zinc-800/50 shadow-2xl ring-1 ring-white/10 group">
                                <Image
                                  src={currentImage}
                                  alt={product.name}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                                  priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Mini setas internas (se houver mais de 1 imagem) */}
                                {productImages.length > 1 && (
                                  <>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const newIndex =
                                          currentImgIndex - 1 < 0
                                            ? productImages.length - 1
                                            : currentImgIndex - 1;
                                        changeProductImage(
                                          product.id,
                                          newIndex,
                                        );
                                      }}
                                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                                    >
                                      <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const newIndex =
                                          (currentImgIndex + 1) %
                                          productImages.length;
                                        changeProductImage(
                                          product.id,
                                          newIndex,
                                        );
                                      }}
                                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                                    >
                                      <ChevronRight className="w-4 h-4" />
                                    </button>

                                    {/* Dots internos (indicadores de imagem) */}
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                      {productImages.map((_, idx) => (
                                        <button
                                          key={idx}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            changeProductImage(product.id, idx);
                                          }}
                                          className={`h-1.5 rounded-full transition-all ${
                                            idx === currentImgIndex
                                              ? "w-4 bg-pink-400"
                                              : "w-1.5 bg-white/40 hover:bg-white/60"
                                          }`}
                                        />
                                      ))}
                                    </div>

                                    {/* Contador de imagens (ex: 2/5) */}
                                    <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm">
                                      {currentImgIndex + 1}/
                                      {productImages.length}
                                    </div>
                                  </>
                                )}
                              </div>

                              {/* Informações do produto */}
                              <div className="flex-1 text-center md:text-left text-white">
                                <h3
                                  className="text-2xl sm:text-3xl md:text-4xl font-bold line-clamp-2 mb-2"
                                  style={{
                                    fontFamily: "var(--font-montserrat)",
                                  }}
                                >
                                  {product.name}
                                </h3>
                                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                                  <span className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                                    {product.price
                                      ? `R$ ${product.price.toFixed(2)}`
                                      : "Consulte"}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleAffiliateClick(product)
                                    }
                                    className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-base font-bold px-8 py-3 rounded-full transition-all shadow-lg shadow-pink-600/30 hover:shadow-pink-600/50 hover:scale-105 flex items-center gap-2"
                                  >
                                    Comprar Agora
                                    <ArrowRight className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Setas de navegação entre produtos (já existentes) */}
                  {heroProducts.length > 1 && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all hover:scale-110 hover:border-pink-500/50 shadow-lg"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all hover:scale-110 hover:border-pink-500/50 shadow-lg"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </div>

                {/* Dots de navegação entre produtos */}
                <div className="flex justify-center gap-3 mt-6">
                  {heroProducts.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`relative h-1.5 rounded-full transition-all duration-500 ${
                        idx === currentSlide
                          ? "w-12 bg-gradient-to-r from-pink-400 to-purple-400 shadow-lg shadow-pink-500/30"
                          : "w-3 bg-white/30 hover:bg-white/50"
                      }`}
                    >
                      {idx === currentSlide && (
                        <span className="absolute inset-0 rounded-full bg-pink-400/30 blur-sm animate-pulse" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Contador de produtos */}
                <div className="text-center mt-4 text-white/40 text-sm font-medium tracking-wider">
                  {currentSlide + 1} / {heroProducts.length}
                </div>
              </div>
            ) : (
              <div className="text-white/50 text-center animate-pulse text-xl">
                Carregando produtos...
              </div>
            )}
          </div>
        </section>

        {/* 2. BARRA DE CONFIANÇA – Afiliados + Produtos Digitais */}
        <section className="border-y border-zinc-800 bg-zinc-900/50 py-4 backdrop-blur-sm animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              {
                icon: <ShieldCheck className="w-4 h-4 text-pink-500" />,
                label: "Parceiros Confiáveis",
              },
              {
                icon: <Truck className="w-4 h-4 text-pink-500" />,
                label: "Frete Rastreado",
              },
              {
                icon: <Package className="w-4 h-4 text-pink-500" />,
                label: "Produtos Originais",
              },
              {
                icon: <Sparkles className="w-4 h-4 text-pink-500" />,
                label: "Download Imediato",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center gap-2 text-zinc-300 text-sm font-medium hover:text-white transition-colors duration-300"
              >
                {item.icon} {item.label}
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================
            3. COMEBACKS & LANÇAMENTOS (filtrados)
            ============================================================ */}
        <section id="produtos" className="py-20 max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 animate-fade-in-up">
            <div>
              <span className="text-pink-500 font-semibold uppercase tracking-wider text-sm">
                Urgência de Fandom
              </span>
              <h2
                className="text-3xl md:text-4xl font-bold tracking-tight mt-1 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_4s_linear_infinite]"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Comebacks & Pré-vendas Quentes
              </h2>
            </div>
            <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-xl hover:border-pink-500/50 transition-colors">
              <Clock className="w-5 h-5 text-pink-500" />
              <span className="text-sm text-zinc-400">Encerra em:</span>
              <span className="font-mono font-bold text-pink-400">
                {String(timeLeft.hours).padStart(2, "0")}:
                {String(timeLeft.minutes).padStart(2, "0")}:
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-zinc-500 animate-pulse">
              Carregando acervo oficial...
            </div>
          ) : comebackProducts.length === 0 ? (
            <div className="text-center py-20 text-zinc-400 border border-dashed border-zinc-700 rounded-2xl animate-fade-in">
              <p className="text-lg">
                Nenhum comeback ou pré-venda no momento.
              </p>
              <p className="text-sm text-zinc-500">
                Fique ligado, em breve teremos novidades!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {comebackProducts.map((product, idx) => (
                <div
                  key={product.id}
                  className="bg-zinc-900 border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-pink-500/50 transition-all duration-300 group flex flex-col justify-between hover:shadow-2xl hover:shadow-pink-500/10 hover:-translate-y-1 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div>
                    <div className="relative aspect-[4/5] overflow-hidden bg-zinc-950">
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                      <span
                        className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full shadow-md ${
                          product.type === "digital"
                            ? "bg-green-600 text-white"
                            : "bg-pink-600 text-white"
                        }`}
                      >
                        {product.type === "digital"
                          ? "📘 Digital"
                          : "📦 Shopee"}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3
                        className="font-semibold text-zinc-100 mt-1 line-clamp-2 group-hover:text-pink-400 transition-colors"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                      >
                        {product.name}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="mt-3 text-lg font-bold text-white">
                        {product.price
                          ? `R$ ${product.price.toFixed(2)}`
                          : "Consulte"}
                      </div>
                    </div>
                  </div>
                  <div className="p-5 pt-0 flex gap-2">
                    <Link
                      href={`/product/${product.id}`}
                      className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2.5 rounded-xl transition-colors text-center text-sm flex items-center justify-center gap-1 hover:gap-2"
                    >
                      Detalhes
                    </Link>
                    <button
                      onClick={() => handleAffiliateClick(product)}
                      className="bg-pink-600 hover:bg-pink-500 text-white font-medium py-2.5 px-3 rounded-xl transition-all flex items-center justify-center hover:scale-105"
                      title="Ir para o parceiro"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ============================================================
            4. NAVEGAÇÃO POR GRUPO
            ============================================================ */}
        <section className="py-16 bg-zinc-900/30 border-y border-zinc-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center max-w-xl mx-auto mb-12 animate-fade-in-up">
              <span className="text-pink-500 font-semibold uppercase tracking-wider text-sm">
                Seu Bias, Suas Regras
              </span>
              <h2
                className="text-3xl font-bold tracking-tight mt-1"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Navegue por Artista
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {groups.map((group, idx) => (
                <button
                  key={idx}
                  onClick={() => alert(`Filtrando produtos de ${group.name}`)}
                  className={`bg-gradient-to-br ${group.color} p-6 rounded-2xl border border-zinc-700/50 hover:border-pink-500 transition-all flex flex-col items-center justify-center gap-3 group shadow-lg hover:shadow-pink-500/20 hover:-translate-y-1 hover:scale-105 duration-300 animate-fade-in-up`}
                  style={{ animationDelay: `${idx * 0.08}s` }}
                >
                  <div className="w-14 h-14 rounded-full bg-zinc-950/60 flex items-center justify-center text-xl font-bold tracking-wider group-hover:scale-110 transition-transform text-white">
                    {group.logoText}
                  </div>
                  <span className="font-semibold text-zinc-200 text-sm group-hover:text-pink-400 transition-colors">
                    {group.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            5. PROVA SOCIAL – Carrossel com imagens reais
            ============================================================ */}
        <section className="py-20 max-w-7xl mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-12 animate-fade-in-up">
            <span className="text-pink-500 font-semibold uppercase tracking-wider text-sm">
              +2.500 compradores confiam
            </span>
            <h2
              className="text-3xl font-bold tracking-tight mt-1"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Depoimentos da Comunidade
            </h2>
            <p className="text-zinc-400 mt-2">
              Veja o que os fãs estão dizendo sobre nossas lojas parceiras e
              produtos digitais.
            </p>
          </div>

          {/* Container do carrossel */}
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-6 md:p-8">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentTestimonial * 100}%)`,
                }}
              >
                {testimonials.map((rev, idx) => (
                  <div
                    key={idx}
                    className="min-w-full px-2 flex flex-col items-center text-center"
                  >
                    {/* Imagem do depoente (foto real) */}
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-pink-500/30 mb-4 flex-shrink-0 shadow-lg shadow-pink-500/10">
                      <Image
                        src={rev.image}
                        alt={rev.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex gap-1 text-yellow-500 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-500" />
                      ))}
                    </div>
                    <p className="text-zinc-200 text-lg md:text-xl italic leading-relaxed max-w-2xl mx-auto">
                      "{rev.text}"
                    </p>
                    <div className="mt-6 border-t border-zinc-800/80 pt-6">
                      <h4 className="font-semibold text-white text-base">
                        {rev.name}
                      </h4>
                      <span className="text-sm text-zinc-400">{rev.group}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Setas de navegação */}
            <button
              onClick={() =>
                setCurrentTestimonial((prev) =>
                  prev === 0 ? testimonials.length - 1 : prev - 1,
                )
              }
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-6 bg-zinc-800 hover:bg-zinc-700 text-white p-2 md:p-3 rounded-full border border-zinc-700 transition-all hover:scale-110 hover:border-pink-500/50 shadow-lg z-10"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={() =>
                setCurrentTestimonial(
                  (prev) => (prev + 1) % testimonials.length,
                )
              }
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-6 bg-zinc-800 hover:bg-zinc-700 text-white p-2 md:p-3 rounded-full border border-zinc-700 transition-all hover:scale-110 hover:border-pink-500/50 shadow-lg z-10"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Dots indicadores */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonial(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentTestimonial
                      ? "w-8 bg-pink-500"
                      : "w-2 bg-zinc-600 hover:bg-zinc-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

       {/* ============================================================
    6. BENEFÍCIOS DETALHADOS – Afiliados + Produtos Digitais
    ============================================================ */}
<section className="py-16 bg-zinc-900/20 border-t border-zinc-800">
  <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
    {[
      {
        icon: <ShieldCheck className="w-6 h-6" />,
        title: "Parceiros Confiáveis",
        desc: "Trabalhamos com Amazon, Shopee e Hotmart – plataformas seguras com política de reembolso, compra protegida e pagamentos via Pix, cartão ou boleto.",
      },
      {
        icon: <Package className="w-6 h-6" />,
        title: "Produtos Verificados",
        desc: "Todos os links levam a vendedores oficiais com alta reputação. Produtos originais, físicos ou digitais, com garantia e suporte das próprias plataformas.",
      },
      {
        icon: <CheckCircle2 className="w-6 h-6" />,
        title: "Suporte Rápido",
        desc: "Tire suas dúvidas sobre produtos, rastreio de pedidos ou downloads com nosso atendimento humanizado via WhatsApp e e-mail, de segunda a sexta.",
      },
    ].map((item, idx) => (
      <div
        key={idx}
        className="flex gap-4 group hover:bg-zinc-800/30 p-4 rounded-xl transition-all duration-300 animate-fade-in-up"
        style={{ animationDelay: `${idx * 0.1}s` }}
      >
        <div className="w-12 h-12 rounded-xl bg-pink-600/10 border border-pink-500/20 flex items-center justify-center shrink-0 text-pink-400 group-hover:bg-pink-600/20 group-hover:border-pink-500/40 transition-all group-hover:scale-110">
          {item.icon}
        </div>
        <div>
          <h3
            className="font-semibold text-lg text-white mb-1 group-hover:text-pink-400 transition-colors"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {item.title}
          </h3>
          <p className="text-zinc-400 text-sm group-hover:text-zinc-300 transition-colors">
            {item.desc}
          </p>
        </div>
      </div>
    ))}
  </div>
</section>

        {/* ============================================================
            7. CTA FINAL / LISTA DE ESPERA
            ============================================================ */}
        <section className="py-24 relative overflow-hidden bg-gradient-to-b from-zinc-900/50 to-zinc-950 border-t border-zinc-800">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600/5 to-purple-600/5" />
          <div className="max-w-3xl mx-auto px-4 text-center relative z-10 animate-fade-in-up">
            <h2
              className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Não perca nenhum <span className="text-pink-500">Comeback</span>
            </h2>
            <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
              Entre na nossa lista de espera VIP e receba alertas de pré-vendas
              e photocards exclusivos direto no seu e-mail antes de esgotarem.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Inscrito com sucesso!");
              }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Seu melhor e-mail..."
                required
                className="bg-zinc-900 border border-zinc-800 px-4 py-3.5 rounded-xl flex-grow text-zinc-100 focus:outline-none focus:border-pink-500 transition-colors hover:border-zinc-600"
              />
              <button
                type="submit"
                className="bg-pink-600 hover:bg-pink-500 text-white font-bold px-6 py-3.5 rounded-xl transition-all shrink-0 shadow-lg shadow-pink-600/20 hover:shadow-pink-600/40 hover:scale-105"
              >
                Quero Participar
              </button>
            </form>
            <span className="text-xs text-zinc-500 mt-3 block">
              Zero spam. Apenas avisos importantes do seu fandom.
            </span>
          </div>
        </section>

        {/* ============================================================
            RODAPÉ
            ============================================================ */}
        <footer className="border-t border-zinc-800/80 bg-zinc-950 py-12 text-zinc-500 text-sm">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <span
                className="font-bold text-white tracking-wider"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                BORA HAUS
              </span>
              <p className="text-xs mt-1">
                Sua curadoria definitiva de K-pop e colecionáveis.
              </p>
            </div>
            {/* <div className="flex gap-6 text-zinc-400">
              <a
                href="#termos"
                className="hover:text-pink-500 transition-colors"
              >
                Termos de Uso
              </a>
              <a
                href="#privacidade"
                className="hover:text-pink-500 transition-colors"
              >
                Política de Privacidade
              </a>
              <a
                href="#contato"
                className="hover:text-pink-500 transition-colors"
              >
                Contato
              </a>
            </div> */}
            <p className="text-xs">
              © 2026 BORA HAUS. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
