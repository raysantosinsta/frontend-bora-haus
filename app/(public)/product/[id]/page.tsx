"use client";

import type { Product } from "@/app/lib/api";
import { fetchProduct, registerClick } from "@/app/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Package,
  ShieldCheck,
  Truck,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ============================================================
// 1. GALERIA DE IMAGENS (com zoom, swipe e navegação)
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
  const [isHovering, setIsHovering] = useState(false);

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
    if (Math.abs(diff) > 40) {
      if (diff > 0) onNext();
      else onPrev();
    }
    setTouchStartX(null);
  };

  const currentImage = images[selectedIndex] || images[0];

  return (
    <div className="space-y-4">
      {/* Imagem principal com zoom */}
      <div
        ref={mainImageRef}
        className={`relative aspect-square rounded-2xl overflow-hidden bg-zinc-900/80 border border-zinc-800/60 group ${
          isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
        }`}
        onDoubleClick={onToggleZoom}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: isZoomed ? 1.8 : 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
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
              quality={85}
            />
          </motion.div>
        </AnimatePresence>

        {/* Botão de zoom (desktop) */}
        <button
          onClick={onToggleZoom}
          className={`absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
            isHovering || isZoomed ? "opacity-100" : "opacity-0"
          }`}
          aria-label={isZoomed ? "Reduzir zoom" : "Ampliar imagem"}
        >
          {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
        </button>

        {/* Navegação (setas) - visíveis em hover e mobile */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100 md:opacity-0 hover:scale-110 disabled:opacity-30"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100 md:opacity-0 hover:scale-110 disabled:opacity-30"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Indicador de página (mobile) */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 md:hidden">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => onSelect(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === selectedIndex
                    ? "w-6 bg-pink-500"
                    : "w-1.5 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Ir para imagem ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Contador de imagens */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-3 bg-black/60 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div
          ref={thumbnailContainerRef}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(idx)}
              className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-200 ${
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
// 2. SKELETON LOADING
// ============================================================
function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        {/* Barra superior */}
        <div className="h-10 w-40 bg-zinc-800 rounded-lg mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-3">
            <div className="aspect-square bg-zinc-800/60 rounded-2xl" />
            <div className="flex gap-3 mt-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-16 h-16 bg-zinc-800/60 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="space-y-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
              <div className="h-6 w-20 bg-zinc-800 rounded-full" />
              <div className="h-8 bg-zinc-800 rounded w-3/4" />
              <div className="h-10 bg-zinc-800 rounded w-1/2" />
              <div className="h-14 bg-zinc-800 rounded-xl" />
              <div className="grid grid-cols-2 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 bg-zinc-800 rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 3. PÁGINA PRINCIPAL
// ============================================================
export default function ProductDetailPage() {
  const params = useParams();
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

  // Loading
  if (loading) return <ProductSkeleton />;

  // Produto não encontrado
  if (!product) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="text-center text-zinc-400">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-semibold text-white">Produto não encontrado</h2>
          <p className="mt-2">O produto que você procura não está disponível.</p>
          <Link
            href="/product"
            className="inline-block mt-6 px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-xl transition-colors"
          >
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* HEADER (sticky) */}
      <div className="sticky top-0 z-20 border-b border-zinc-800/60 bg-zinc-900/80 backdrop-blur-md py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            href="/product"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao catálogo
          </Link>
          <span className="text-xs text-zinc-500 hidden sm:inline truncate max-w-[200px]">
            {product.name}
          </span>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* GALERIA (3/5) */}
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

            {/* Descrição (visível abaixo da galeria em mobile) */}
            <div className="mt-8 border-t border-zinc-800/60 pt-8 lg:hidden">
              <h2 className="text-lg font-semibold text-white mb-3">Sobre este produto</h2>
              <p className="text-zinc-300 leading-relaxed">{product.description}</p>
            </div>
          </div>

          {/* CARD DE COMPRA (2/5, sticky) */}
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

              {/* Selos de confiança */}
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
                <div className="hidden lg:block border-t border-zinc-800/60 pt-4">
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
      </div>
    </div>
  );
}