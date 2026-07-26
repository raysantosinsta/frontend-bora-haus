"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, ExternalLink, Loader2, Search } from "lucide-react";
import { Product } from "@/app/page";
import { useAdminAuth } from "@/app/hooks/useAdminAuth";

export default function AdminProducts() {
  const router = useRouter();
  const { isAuthenticated } = useAdminAuth(true);

  // ✅ TODOS OS HOOKS AQUI
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3334";
      const res = await fetch(`${apiUrl}/products`);
      if (!res.ok) throw new Error("Erro ao carregar produtos");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // ⬇️ EARLY RETURN DEPOIS DOS HOOKS
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        Verificando acesso...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    setDeletingId(id);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3334";
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";
      const res = await fetch(`${apiUrl}/products/${id}`, {
        method: "DELETE",
        headers: { "x-api-key": apiKey },
      });
      if (!res.ok) throw new Error("Erro ao excluir");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Erro ao excluir produto. Tente novamente.");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1
              className="text-3xl font-bold"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Gerenciar Produtos
            </h1>
            <p className="text-zinc-400 text-sm">
              {products.length} produtos cadastrados
            </p>
          </div>
          <Link
            href="/admin/products/novo"
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-pink-600/20"
          >
            <Plus className="w-5 h-5" />
            Novo Produto
          </Link>
        </div>

        {/* Busca */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition-colors"
          />
        </div>

        {/* Lista */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-zinc-700 rounded-2xl">
            <p className="text-zinc-400">Nenhum produto encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-pink-500/50 transition-all flex flex-col"
              >
                <div className="relative aspect-square bg-zinc-800">
                  <Image
                    src={product.image_url || "/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <span
                    className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full ${
                      product.type === "digital"
                        ? "bg-green-600 text-white"
                        : "bg-pink-600 text-white"
                    }`}
                  >
                    {product.type === "digital" ? "Digital" : "Físico"}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3
                    className="font-semibold text-base line-clamp-1"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {product.name}
                  </h3>
                  <p className="text-sm text-zinc-400 line-clamp-2 flex-1 mt-1">
                    {product.description || "Sem descrição"}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-white">
                      {product.price
                        ? `R$ ${product.price.toFixed(2)}`
                        : "Consulte"}
                    </span>
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/${product.id}/editar`}
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4 text-zinc-300" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                        className="p-2 rounded-lg bg-red-900/30 hover:bg-red-900/50 transition-colors disabled:opacity-50"
                        title="Excluir"
                      >
                        {deletingId === product.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                        ) : (
                          <Trash2 className="w-4 h-4 text-red-400" />
                        )}
                      </button>
                      <a
                        href={product.affiliate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-blue-900/30 hover:bg-blue-900/50 transition-colors"
                        title="Abrir link afiliado"
                      >
                        <ExternalLink className="w-4 h-4 text-blue-400" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}