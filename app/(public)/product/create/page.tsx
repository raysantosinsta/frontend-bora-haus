"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAdminAuth } from "@/app/hooks/useAdminAuth";
import {
  ArrowLeft,
  Upload,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Plus,
} from "lucide-react";

export default function CreateProductPage() {
  const router = useRouter();
  const { isAuthenticated } = useAdminAuth(true); // redireciona se não autenticado

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dados do formulário
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    type: "affiliate" as "digital" | "affiliate",
    affiliate_url: "",
    categoria: "",
  });

  // Arquivos selecionados
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const total = selectedFiles.length + files.length;
    if (total > 10) {
      alert("Máximo de 10 imagens por produto.");
      return;
    }

    setSelectedFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validações
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
      setError("É necessário enviar pelo menos uma imagem.");
      setLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3334";
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";

      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("price", formData.price || "0");
      payload.append("type", formData.type);
      payload.append("affiliate_url", formData.affiliate_url);
      payload.append("categoria", formData.categoria);

      selectedFiles.forEach((file) => {
        payload.append("files", file);
      });

      const response = await fetch(`${apiUrl}/products`, {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
        },
        body: payload,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar produto");
      }

      setSuccess(true);
      // Redireciona após 2 segundos
      setTimeout(() => {
        router.push("product");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar produto");
    } finally {
      setLoading(false);
    }
  };

  // Se ainda está verificando autenticação, mostra loader
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );
  }

  // Se não autenticado, o hook já redireciona, mas por segurança:
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/30 py-4">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">
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
              placeholder="Ex: Álbum BTS - BE"
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
              rows={4}
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

          {/* Categoria */}
          <div>
            <label
              htmlFor="categoria"
              className="block text-sm font-medium text-zinc-300 mb-1"
            >
              Categoria
            </label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleInputChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-pink-500 transition-colors"
            >
              <option value="">Selecione uma categoria</option>
              <option value="album">Álbum</option>
              <option value="photocards">Photocards</option>
              <option value="eletronicos">Eletrônicos</option>
              <option value="roupas">Roupas</option>
              <option value="livros">Livros</option>
              <option value="outros">Outros</option>
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
              placeholder="https://..."
              required
            />
          </div>

          {/* Imagens */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Imagens do Produto *
            </label>

            {/* Área de upload */}
            <div className="mt-1 flex flex-col items-center justify-center w-full">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 text-zinc-500 mb-3" />
                  <p className="text-sm text-zinc-400">
                    <span className="font-semibold">Clique para enviar</span> ou arraste
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    PNG, JPG, WEBP até 10MB (máx. 10 imagens)
                  </p>
                  <p className="text-xs text-pink-400 mt-2">
                    {selectedFiles.length} arquivo(s) selecionado(s)
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
            </div>

            {/* Previews das imagens */}
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
                      className="absolute top-1 right-1 bg-red-600 hover:bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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

          {/* Botão de submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-pink-600/20 hover:shadow-pink-600/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Criando produto...
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