"use client";

import type { Product } from "@/app/lib/api";
import { fetchProduct, registerClick } from "@/app/lib/api";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Package,
  ShieldCheck,
  Star,
  Truck
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ============================================================
// 1. COMPONENTE DE GALERIA (controlado)
// ============================================================
interface ProductGalleryProps {
  images: string[];
  alt: string;
  selectedIndex: number;
  onSelect: (index: number) => void;
  onNext: () => void;
  onPrev: () => void;
  isZoomed?: boolean;
  onToggleZoom?: () => void;
}

function ProductGallery({
  images,
  alt,
  selectedIndex,
  onSelect,
  onNext,
  onPrev,
  isZoomed = false,
  onToggleZoom,
}: ProductGalleryProps) {
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  const currentImage = images[selectedIndex] || images[0];

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onNext();
      } else if (e.key === "Escape" && isZoomed) {
        onToggleZoom?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onPrev, onNext, isZoomed, onToggleZoom]);

  // Scroll automático para a miniatura ativa
  useEffect(() => {
    if (thumbnailContainerRef.current) {
      const container = thumbnailContainerRef.current;
      const activeThumb = container.children[selectedIndex] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [selectedIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) onNext();
      else onPrev();
    }
    setTouchStartX(null);
  };

  return (
    <div className="space-y-3">
      {/* Imagem principal com zoom */}
      <div
        ref={mainImageRef}
        className={`relative aspect-square rounded-2xl overflow-hidden bg-zinc-800/50 border border-zinc-800/50 group ${
          isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
        }`}
        onDoubleClick={onToggleZoom}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <motion.div
          key={selectedIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: isZoomed ? 1.8 : 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full h-full relative"
        >
          <Image
            src={currentImage}
            alt={`${alt} - imagem ${selectedIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
            priority={selectedIndex === 0}
            quality={90}
          />
        </motion.div>

        {/* Botões de navegação (desktop) */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Indicador de página (mobile) */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => onSelect(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === selectedIndex
                    ? "w-6 bg-pink-500"
                    : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        )}

        {/* Contador de imagens */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Miniaturas (apenas se houver mais de uma) */}
      {images.length > 1 && (
        <div
          ref={thumbnailContainerRef}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(idx)}
              className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all duration-200 ${
                idx === selectedIndex
                  ? "border-pink-500 shadow-lg shadow-pink-500/20 scale-105"
                  : "border-transparent hover:border-zinc-600"
              }`}
            >
              <Image
                src={img}
                alt={`Miniatura ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 2. COMPONENTE DE AVALIAÇÕES (simulado)
// ============================================================
const reviews = [
  {
    id: 1,
    name: "Mariana S.",
    avatar: "https://i.pravatar.cc/100?img=1",
    rating: 5,
    comment: "Produto incrível, entrega super rápida! Recomendo demais.",
    date: "10/04/2025",
  },
  {
    id: 2,
    name: "Rafael O.",
    avatar: "https://i.pravatar.cc/100?img=2",
    rating: 4,
    comment: "Muito bom, mas a embalagem poderia ser melhor.",
    date: "08/04/2025",
  },
  {
    id: 3,
    name: "Beatriz L.",
    avatar: "https://i.pravatar.cc/100?img=3",
    rating: 5,
    comment: "Qualidade excelente, superou minhas expectativas.",
    date: "05/04/2025",
  },
];

function ReviewsSection() {
  const averageRating = 4.8;
  const totalReviews = 127;

  return (
    <div className="mt-8 border-t border-zinc-800 pt-8">
      <div className="flex items-start gap-6">
        <div className="flex flex-col items-center">
          <span className="text-4xl font-bold text-white">{averageRating}</span>
          <div className="flex gap-0.5 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(averageRating)
                    ? "fill-yellow-500 text-yellow-500"
                    : "text-zinc-600"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-zinc-400 mt-1">{totalReviews} avaliações</span>
        </div>

        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = Math.floor(totalReviews * (star / 5));
            const percentage = (count / totalReviews) * 100;
            return (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="text-zinc-400 w-4">{star}</span>
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <div className="flex-1 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-zinc-500 text-xs w-8">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {reviews.map((review, idx) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="border-t border-zinc-800/50 pt-4"
          >
            <div className="flex items-start gap-3">
              <Image
                src={review.avatar}
                alt={review.name}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-white">{review.name}</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-zinc-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-zinc-500">{review.date}</span>
                </div>
                <p className="text-zinc-300 text-sm mt-1">{review.comment}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// 3. SKELETON LOADING
// ============================================================
function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <div className="aspect-square bg-zinc-800 rounded-2xl"></div>
            <div className="flex gap-2 mt-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-16 h-16 bg-zinc-800 rounded-lg"></div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-6 bg-zinc-800 rounded w-1/4"></div>
            <div className="h-10 bg-zinc-800 rounded w-3/4"></div>
            <div className="h-8 bg-zinc-800 rounded w-1/3"></div>
            <div className="h-20 bg-zinc-800 rounded"></div>
            <div className="h-14 bg-zinc-800 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 4. PÁGINA PRINCIPAL
// ============================================================
export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  // Carregar produto
  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await fetchProduct(productId);
        setProduct(data);
        setSelectedImage(0);
        setIsZoomed(false);
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  // Navegação da galeria
  const images = useMemo(() => {
    if (!product) return [];
    return product.images && product.images.length > 0
      ? product.images
      : [product.image_url];
  }, [product]);

  const handleNext = useCallback(() => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleSelect = useCallback((index: number) => {
    setSelectedImage(index);
    setIsZoomed(false);
  }, []);

  const toggleZoom = useCallback(() => {
    setIsZoomed((prev) => !prev);
  }, []);

  // Compra
  const handleBuyClick = async () => {
    if (!product) return;
    setIsBuying(true);
    try {
      const destination = product.type === "digital" ? "hotmart" : "shopee";
      await registerClick(product.id, destination);
      window.open(product.affiliate_url, "_blank");
    } catch (error) {
      console.error("Erro ao registrar clique:", error);
      window.open(product.affiliate_url, "_blank");
    } finally {
      setIsBuying(false);
    }
  };

  // Renderização condicional
  if (loading) return <ProductSkeleton />;
  if (!product) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400 text-center">
          <p className="text-xl">Produto não encontrado</p>
          <Link href="/product" className="text-pink-500 hover:underline mt-2 block">
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* HEADER */}
      <div className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            href="/product"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao catálogo
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 hidden sm:inline">
              {product.name?.substring(0, 30)}...
            </span>
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* GALERIA (ocupa 3/5 no desktop) */}
          <div className="lg:col-span-3">
            <ProductGallery
              images={images}
              alt={product.name}
              selectedIndex={selectedImage}
              onSelect={handleSelect}
              onNext={handleNext}
              onPrev={handlePrev}
              isZoomed={isZoomed}
              onToggleZoom={toggleZoom}
            />

            {/* Descrição expandida (abaixo da galeria em mobile) */}
            <div className="mt-8 border-t border-zinc-800 pt-8 lg:hidden">
              <h2 className="text-lg font-semibold text-white mb-3">Sobre este produto</h2>
              <p className="text-zinc-300 leading-relaxed">{product.description}</p>
            </div>
          </div>

          {/* CARD DE COMPRA (ocupa 2/5 no desktop, sticky) */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:sticky lg:top-24 space-y-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm"
            >
              {/* Badge de tipo */}
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full w-fit ${
                  product.type === "digital"
                    ? "bg-green-600/20 text-green-400 border border-green-500/30"
                    : "bg-pink-600/20 text-pink-400 border border-pink-500/30"
                }`}
              >
                {product.type === "digital" ? "📘 Digital" : "📦 Físico"}
              </span>

              {/* Nome */}
              <h1
                className="text-2xl md:text-3xl font-bold text-white leading-tight"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {product.name}
              </h1>

              {/* Preço */}
              <div>
                <span className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                  {product.price ? `R$ ${product.price.toFixed(2)}` : "Consulte"}
                </span>
                {product.price && (
                  <div className="text-sm text-zinc-400 mt-1">
                    em até 12x sem juros
                  </div>
                )}
              </div>

              {/* Botão Comprar */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBuyClick}
                disabled={isBuying}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-pink-600/30 hover:shadow-pink-600/50 flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isBuying ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Processando...
                  </>
                ) : (
                  <>
                    Comprar Agora <ExternalLink className="w-5 h-5" />
                  </>
                )}
              </motion.button>

              {/* Selos de confiança (compactos) */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: ShieldCheck, label: "Compra Segura" },
                  { icon: Truck, label: "Entrega Rastreada" },
                  { icon: Package, label: "Produto Original" },
                  { icon: Clock, label: "Download Imediato" },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-2 bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-3 py-2.5"
                  >
                    <item.icon className="w-4 h-4 text-pink-500" />
                    <span className="text-xs text-zinc-300">{item.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* Descrição (apenas desktop) */}
              {product.description && (
                <div className="hidden lg:block border-t border-zinc-800 pt-4">
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                    Descrição
                  </h3>
                  <p className="text-zinc-300 text-sm mt-1 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* SEÇÃO DE AVALIAÇÕES (abaixo da galeria e card) */}
        <div className="mt-12 border-t border-zinc-800 pt-8">
          <ReviewsSection />
        </div>
      </div>
    </div>
  );
}