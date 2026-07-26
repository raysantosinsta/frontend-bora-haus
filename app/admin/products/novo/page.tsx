"use client";

import { useAdminAuth } from "@/app/hooks/useAdminAuth";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Upload,
  X
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function NovoProdutoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  // Arquivos selecionados
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

    const { isAuthenticated } = useAdminAuth(true);
  
    if (isAuthenticated === null) {
      return <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">Verificando acesso...</div>;
    }
  
    if (!isAuthenticated) {
      return null; // redireciona para /admin/login
    }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Limitar a 10 arquivos
    const newFiles = [...selectedFiles, ...files].slice(0, 10);
    setSelectedFiles(newFiles);

    // Gerar previews
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    // Revogar URL do preview removido
    URL.revokeObjectURL(previews[index]);
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validação...
    if (!formData.name.trim()) {
      setError("O nome do produto é obrigatório.");
      setLoading(false);
      return;
    }
    if (!formData.affiliate_url.trim()) {
      setError("A URL de afiliado é obrigatória.");
      setLoading(false);
      return;
    }
    if (selectedFiles.length === 0) {
      setError("Envie pelo menos uma imagem do produto.");
      setLoading(false);
      return;
    }

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("price", formData.price || "0");
      payload.append("type", formData.type);
      payload.append("affiliate_url", formData.affiliate_url);

      selectedFiles.forEach((file) => {
        payload.append("files", file);
      });

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3334";
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";

      const response = await fetch(`${apiUrl}/products`, {
        method: "POST",
        headers: {
          "x-api-key": apiKey, // 👈 importante
        },
        body: payload,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar produto");
      }

      setSuccess(true);
      // Limpar formulário...
      setTimeout(() => router.push("/product"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar produto");
    } finally {
      setLoading(false);
    }
  };

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
            Novo Produto
          </h1>
        </div>
      </div>

      {/* Formulário */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-zinc-300 mb-1"
            >
              Nome do Produto *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition-colors"
              placeholder="Ex: Álbum 5-STAR (Stray Kids)"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-zinc-300 mb-1"
            >
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition-colors resize-y"
              placeholder="Descreva o produto..."
            />
          </div>

          {/* Preço */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-zinc-300 mb-1"
            >
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
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition-colors"
              placeholder="89.90"
            />
          </div>

          {/* Tipo */}
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-zinc-300 mb-1"
            >
              Tipo de Produto *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-pink-500 transition-colors"
            >
              <option value="affiliate">Físico (Shopee/Amazon)</option>
              <option value="digital">Digital (Hotmart)</option>
            </select>
          </div>

          {/* URL de Afiliado */}
          <div>
            <label
              htmlFor="affiliate_url"
              className="block text-sm font-medium text-zinc-300 mb-1"
            >
              URL de Afiliado *
            </label>
            <input
              type="url"
              id="affiliate_url"
              name="affiliate_url"
              value={formData.affiliate_url}
              onChange={handleInputChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition-colors"
              placeholder="https://shope.ee/..."
              required
            />
          </div>

          {/* Upload de imagens */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Imagens do Produto *
            </label>
            <div className="mt-1 flex flex-col items-center justify-center w-full">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-zinc-500 mb-2" />
                  <p className="text-sm text-zinc-400">
                    <span className="font-semibold">Clique para enviar</span> ou
                    arraste
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    PNG, JPG, WEBP até 10MB (máx. 10 arquivos)
                  </p>
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
                {selectedFiles.length} / 10 arquivos selecionados
              </p>
            </div>

            {/* Previews */}
            {previews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {previews.map((src, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden bg-zinc-800 group"
                  >
                    <Image
                      src={src}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
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
              <span className="text-sm">
                Produto criado com sucesso! Redirecionando...
              </span>
            </div>
          )}

          {/* Botão submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-pink-600/20 hover:shadow-pink-600/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Criando...
              </>
            ) : (
              "Criar Produto"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
