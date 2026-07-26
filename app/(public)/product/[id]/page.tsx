"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { fetchProduct, registerClick } from "@/app/lib/api";
import type { Product } from "@/app/lib/api";
import { ArrowLeft, ExternalLink, Star, Clock, Package, ShieldCheck, Truck } from "lucide-react";
import ImageCarousel from "@/app/components/ImageCarousel";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await fetchProduct(productId);
        setProduct(data);
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  const handleBuyClick = async () => {
    if (!product) return;
    try {
      // Registrar clique no backend
      const destination = product.type === 'digital' ? 'hotmart' : 'shopee';
      await registerClick(product.id, destination);
      // Abrir link de afiliado
      window.open(product.affiliate_url, '_blank');
    } catch (error) {
      console.error('Erro ao registrar clique:', error);
      // Mesmo com erro, abrir o link
      window.open(product.affiliate_url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-500 animate-pulse text-xl">Carregando produto...</div>
      </div>
    );
  }

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

  const images = product.images && product.images.length > 0 ? product.images : [product.image_url];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header da página */}
      <div className="border-b border-zinc-800 bg-zinc-900/30 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/product"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao catálogo
          </Link>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Coluna esquerda - Carrossel */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-zinc-800 shadow-2xl">
              <ImageCarousel
                images={images}
                alt={product.name}
                className="w-full h-full"
              />
            </div>
            {/* Thumbnails (opcional) */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      idx === selectedImage
                        ? "border-pink-500"
                        : "border-transparent hover:border-zinc-600"
                    }`}
                  >
                    <Image src={img} alt={`Miniatura ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Coluna direita - Informações */}
          <div className="flex flex-col">
            {/* Badge de tipo */}
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full w-fit ${
                product.type === "digital"
                  ? "bg-green-600/20 text-green-400 border border-green-500/30"
                  : "bg-pink-600/20 text-pink-400 border border-pink-500/30"
              }`}
            >
              {product.type === "digital" ? "📘 Produto Digital" : "📦 Produto Físico"}
            </span>

            {/* Nome */}
            <h1
              className="text-3xl md:text-4xl font-bold mt-3"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {product.name}
            </h1>

            {/* Preço */}
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                {product.price ? `R$ ${product.price.toFixed(2)}` : "Consulte o preço"}
              </span>
            </div>

            {/* Descrição */}
            {product.description && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Descrição</h3>
                <p className="text-zinc-300 mt-1 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Botão de compra */}
            <button
              onClick={handleBuyClick}
              className="mt-6 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-pink-600/30 hover:shadow-pink-600/50 hover:scale-105 flex items-center justify-center gap-2 text-lg"
            >
              Comprar Agora
              <ExternalLink className="w-5 h-5" />
            </button>

            {/* Selos de confiança */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-3 py-2.5">
                <ShieldCheck className="w-5 h-5 text-pink-500" />
                <span className="text-xs text-zinc-300">Compra Segura</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-3 py-2.5">
                <Truck className="w-5 h-5 text-pink-500" />
                <span className="text-xs text-zinc-300">Entrega Rastreada</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-3 py-2.5">
                <Package className="w-5 h-5 text-pink-500" />
                <span className="text-xs text-zinc-300">Produto Original</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-3 py-2.5">
                <Clock className="w-5 h-5 text-pink-500" />
                <span className="text-xs text-zinc-300">Download Imediato</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}