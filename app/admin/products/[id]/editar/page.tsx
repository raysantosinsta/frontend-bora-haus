"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAdminAuth } from "@/app/hooks/useAdminAuth";

export default function EditarProdutoPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Campos do formulário
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    type: "affiliate" as "digital" | "affiliate",
    affiliate_url: "",
  });

  // Imagens existentes (URLs) e novos arquivos selecionados
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

    const { isAuthenticated } = useAdminAuth(true);
  
    if (isAuthenticated === null) {
      return <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">Verificando acesso...</div>;
    }
  
    if (!isAuthenticated) {
      return null; // redireciona para /admin/login
    }

  // Carregar dados do produto
  useEffect(() => {
    async function loadProduct() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3334";
        const res = await fetch(`${apiUrl}/products/${productId}`);
        if (!res.ok) throw new Error("Produto não encontrado");
        const data = await res.json();
        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price ? String(data.price) : "",
          type: data.type || "affiliate",
          affiliate_url: data.affiliate_url || "",
        });
        setExistingImages(data.images || []);
      } catch (err) {
        setError("Erro ao carregar produto");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Somar aos novos arquivos (máx 10 no total, considerando os existentes)
    const total = existingImages.length + newFiles.length + files.length;
    if (total > 10) {
      alert("Máximo de 10 imagens por produto.");
      return;
    }

    setNewFiles((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setNewPreviews((prev) => [...prev, ...previews]);
  };

  const removeNewFile = (index: number) => {
    URL.revokeObjectURL(newPreviews[index]);
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    // Validação simples
    if (!formData.name.trim()) {
      setError("O nome do produto é obrigatório.");
      setSaving(false);
      return;
    }
    if (!formData.affiliate_url.trim()) {
      setError("A URL de afiliado é obrigatória.");
      setSaving(false);
      return;
    }
    // Se não houver imagens existentes nem novas, erro
    if (existingImages.length === 0 && newFiles.length === 0) {
      setError("É necessário pelo menos uma imagem.");
      setSaving(false);
      return;
    }

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("price", formData.price || "0");
      payload.append("type", formData.type);
      payload.append("affiliate_url", formData.affiliate_url);

      // Envia os novos arquivos (se houver)
      newFiles.forEach((file) => {
        payload.append("files", file);
      });

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3334";
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";

      const response = await fetch(`${apiUrl}/products/${productId}`, {
        method: "PUT",
        headers: {
          "x-api-key": apiKey,
        },
        body: payload,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar produto");
      }

      setSuccess(true);
      setTimeout(() => router.push("/admin/products"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/30 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Editar Produto
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1">
              Nome do Produto *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-pink-500"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-1">
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-pink-500 resize-y"
            />
          </div>

          {/* Preço */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-zinc-300 mb-1">
              Preço (R$)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-pink-500"
              placeholder="89.90"
            />
          </div>

          {/* Tipo */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-zinc-300 mb-1">
              Tipo de Produto *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-pink-500"
            >
              <option value="affiliate">Físico (Shopee/Amazon)</option>
              <option value="digital">Digital (Hotmart)</option>
            </select>
          </div>

          {/* URL de Afiliado */}
          <div>
            <label htmlFor="affiliate_url" className="block text-sm font-medium text-zinc-300 mb-1">
              URL de Afiliado *
            </label>
            <input
              type="url"
              id="affiliate_url"
              name="affiliate_url"
              value={formData.affiliate_url}
              onChange={handleInputChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-pink-500"
              required
            />
          </div>

          {/* Imagens */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Imagens do Produto *
            </label>

            {/* Imagens existentes */}
            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-zinc-500 mb-2">Imagens atuais ({existingImages.length})</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {existingImages.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-zinc-800">
                      <Image src={url} alt={`Imagem ${idx+1}`} fill className="object-cover" />
                      {/* Não permitimos remover individualmente por simplicidade, mas poderia */}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-zinc-500 mt-2">Para trocar as imagens, envie novas abaixo. As antigas serão substituídas.</p>
              </div>
            )}

            {/* Upload de novas imagens */}
            <div className="mt-1 flex flex-col items-center justify-center w-full">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-zinc-500 mb-2" />
                  <p className="text-sm text-zinc-400">
                    <span className="font-semibold">Clique para enviar</span> ou arraste
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">PNG, JPG, WEBP até 10MB (máx. 10)</p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-zinc-500 mt-2">
                {newFiles.length} novo(s) arquivo(s) selecionado(s)
              </p>
            </div>

            {/* Previews dos novos arquivos */}
            {newPreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {newPreviews.map((src, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden bg-zinc-800 group"
                  >
                    <Image src={src} alt={`Novo preview ${index + 1}`} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewFile(index)}
                      className="absolute top-1 right-1 bg-red-600 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Feedback */}
          {error && (
            <div className="flex items-center gap-2 bg-red-600/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 bg-green-600/20 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">Produto atualizado com sucesso! Redirecionando...</span>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-pink-600/20 hover:shadow-pink-600/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Salvando...
              </>
            ) : (
              "Atualizar Produto"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}