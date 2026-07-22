"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Product } from "@/app/types";
import { fetchProduct, registerClick } from "@/app/lib/api";

export default function RedirectPage() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAndRedirect = async () => {
      try {
        // 1. Buscar o produto para pegar o affiliate_url
        const prod = await fetchProduct(productId);
        setProduct(prod);

        /// Mapeia o tipo do produto para a plataforma correspondente
        const platformMap: Record<Product["type"], "hotmart" | "shopee"> = {
          digital: "hotmart",
          affiliate: "shopee",
        };

        await registerClick(productId, platformMap[prod.type]);

        // 3. Iniciar contagem regressiva
        let timer = 3;
        const interval = setInterval(() => {
          timer -= 1;
          setCountdown(timer);
          if (timer <= 0) {
            clearInterval(interval);
            // 4. Redirecionar para o link de afiliado (Shopee ou Hotmart)
            window.location.replace(prod.affiliate_url);
          }
        }, 1000);

        setLoading(false);
      } catch (error) {
        console.error("Erro no redirecionamento:", error);
        alert("Erro ao carregar o produto. Tente novamente.");
        setLoading(false);
      }
    };

    loadAndRedirect();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-purple-50">
        <p className="text-xl text-purple-800">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-50 p-4 text-center">
      <div className="bg-white p-12 rounded-2xl shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-purple-800 mb-2">
          🔄 Redirecionando...
        </h1>
        <p className="text-gray-600 mb-8">
          Você está sendo encaminhado para{" "}
          <strong>{product?.type === "digital" ? "Hotmart" : "Shopee"}</strong>{" "}
          em {countdown} segundo{countdown > 1 ? "s" : ""}.
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div
            className="bg-purple-600 h-2.5 rounded-full transition-all duration-1000"
            style={{ width: `${((3 - countdown) / 3) * 100}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-400">
          Você será redirecionado automaticamente.
        </p>
        {product && (
          <button
            onClick={() => window.location.replace(product.affiliate_url)}
            className="mt-6 text-purple-600 underline text-sm"
          >
            Clique aqui se o redirecionamento não funcionar
          </button>
        )}
      </div>
    </div>
  );
}
