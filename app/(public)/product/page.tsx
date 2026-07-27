"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ExternalLink,
  Grid3x3,
  List,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import type { Product } from "@/app/lib/api";
import { fetchProducts } from "@/app/lib/api";

// ============================================================
// Componente principal (encapsula em Suspense)
// ============================================================
export default function CatalogoPage() {
  return (
    <Suspense fallback={<CatalogoSkeleton />}>
      <CatalogoContent />
    </Suspense>
  );
}

// ============================================================
// Conteúdo real (usa useSearchParams)
// ============================================================
function CatalogoContent() {
  const searchParams = useSearchParams();
  const artistParam = searchParams.get("artist") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(artistParam);
  const [filterType, setFilterType] = useState<"all" | "digital" | "affiliate">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Carrega os produtos
  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Sincroniza searchTerm com o parâmetro da URL
  useEffect(() => {
    setSearchTerm(artistParam);
  }, [artistParam]);

  // Filtros
  useEffect(() => {
    let result = products;
    if (filterType !== "all") {
      result = result.filter((p) => p.type === filterType);
    }
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term)
      );
    }
    setFilteredProducts(result);
  }, [searchTerm, filterType, products]);

  // ===== SEGURO: window.open somente no cliente =====
  const handleAffiliateClick = (product: Product) => {
    if (product.affiliate_url && typeof window !== "undefined") {
      window.open(product.affiliate_url, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Cabeçalho */}
      <section className="border-b border-zinc-800 bg-zinc-900/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Catálogo de Produtos
          </h1>
          <p className="text-zinc-400 mt-2">
            {filteredProducts.length} produtos encontrados
          </p>
        </div>
      </section>

      {/* Barra de filtros */}
      <section className="border-b border-zinc-800 bg-zinc-900/20 py-4 sticky top-16 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition-colors"
              />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) =>
                    setFilterType(e.target.value as typeof filterType)
                  }
                  className="appearance-none bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 pr-10 text-sm text-zinc-100 focus:outline-none focus:border-pink-500 transition-colors cursor-pointer"
                >
                  <option value="all">Todos os tipos</option>
                  <option value="affiliate">Físicos (Shopee/Amazon)</option>
                  <option value="digital">Digitais (Hotmart)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              </div>
              <div className="flex border border-zinc-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${
                    viewMode === "grid"
                      ? "bg-pink-600 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors ${
                    viewMode === "list"
                      ? "bg-pink-600 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Listagem */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-20 text-zinc-500 animate-pulse">
            Carregando produtos...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-zinc-400 border border-dashed border-zinc-700 rounded-2xl">
            <p className="text-lg">Nenhum produto encontrado</p>
            <p className="text-sm text-zinc-500 mt-1">
              Tente ajustar os filtros ou buscar por outro termo.
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAffiliateClick={handleAffiliateClick}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredProducts.map((product) => (
              <ProductListItem
                key={product.id}
                product={product}
                onAffiliateClick={handleAffiliateClick}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ============================================================
// SKELETON (fallback do Suspense)
// ============================================================
function CatalogoSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="border-b border-zinc-800 bg-zinc-900/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-12 w-48 bg-zinc-700 rounded animate-pulse" />
          <div className="h-4 w-32 bg-zinc-700 rounded mt-2 animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="aspect-square bg-zinc-800 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-zinc-700 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-zinc-700 rounded w-full animate-pulse" />
                <div className="h-6 bg-zinc-700 rounded w-1/3 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ProductCard (com carrossel interno)
// ============================================================
function ProductCard({
  product,
  onAffiliateClick,
}: {
  product: Product;
  onAffiliateClick: (p: Product) => void;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image_url].filter(Boolean);

  const hasMultipleImages = images.length > 1;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-pink-500/50 transition-all duration-300 group flex flex-col hover:-translate-y-1 hover:shadow-2xl hover:shadow-pink-500/10">
      <div className="relative aspect-square overflow-hidden bg-zinc-800">
        <Image
          src={images[currentImageIndex] || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
        />

        <span
          className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full shadow-md z-10 ${
            product.type === "digital"
              ? "bg-green-600 text-white"
              : "bg-pink-600 text-white"
          }`}
        >
          {product.type === "digital" ? "📘 Digital" : "📦 Físico"}
        </span>

        {hasMultipleImages && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110 z-20"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110 z-20"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToImage(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentImageIndex
                      ? "w-4 bg-pink-400"
                      : "w-1.5 bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3
          className="font-semibold text-zinc-100 text-lg line-clamp-2 group-hover:text-pink-400 transition-colors"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          {product.name}
        </h3>
        <p className="text-sm text-zinc-400 mt-1 line-clamp-2 flex-1">
          {product.description || "Sem descrição"}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xl font-bold text-white">
            {product.price ? `R$ ${product.price.toFixed(2)}` : "Consulte"}
          </span>
          <div className="flex items-center gap-2">
            <Link
              href={`/product/${product.id}`}
              className="bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium px-4 py-2 rounded-full transition-all"
            >
              Detalhes
            </Link>
            <button
              onClick={() => onAffiliateClick(product)}
              className="bg-pink-600 hover:bg-pink-500 text-white text-sm font-medium px-4 py-2 rounded-full transition-all hover:scale-105 shadow-lg shadow-pink-600/20 flex items-center gap-1"
            >
              Comprar <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ProductListItem (modo lista)
// ============================================================
function ProductListItem({
  product,
  onAffiliateClick,
}: {
  product: Product;
  onAffiliateClick: (p: Product) => void;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-pink-500/50 transition-all duration-300 flex flex-col sm:flex-row gap-4 p-4 hover:shadow-xl hover:shadow-pink-500/5">
      <div className="relative w-full sm:w-40 h-40 sm:h-40 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-800">
        <Image
          src={product.image_url || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover"
          sizes="160px"
        />
        <span
          className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full shadow-md ${
            product.type === "digital"
              ? "bg-green-600 text-white"
              : "bg-pink-600 text-white"
          }`}
        >
          {product.type === "digital" ? "Digital" : "Físico"}
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3
            className="font-semibold text-zinc-100 text-lg hover:text-pink-400 transition-colors"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {product.name}
          </h3>
          <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
            {product.description || "Sem descrição"}
          </p>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xl font-bold text-white">
            {product.price ? `R$ ${product.price.toFixed(2)}` : "Consulte"}
          </span>
          <div className="flex items-center gap-2">
            <Link
              href={`/product/${product.id}`}
              className="bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium px-4 py-2 rounded-full transition-all"
            >
              Detalhes
            </Link>
            <button
              onClick={() => onAffiliateClick(product)}
              className="bg-pink-600 hover:bg-pink-500 text-white text-sm font-medium px-5 py-2 rounded-full transition-all hover:scale-105 shadow-lg shadow-pink-600/20 flex items-center gap-1"
            >
              Comprar <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}