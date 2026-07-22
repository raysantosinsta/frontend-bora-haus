'use client';

import { useState } from 'react';
import { createProduct } from '../lib/api';

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData(event.currentTarget);
    const apiKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || '';

    try {
      await createProduct(formData, apiKey);
      setMessage('✅ Produto cadastrado com sucesso!');
      event.currentTarget.reset();
    } catch (error: any) {
      setMessage(`❌ Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">💜 Cadastrar Produto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Nome do Produto (ex: Photocard Jungkook)" required className="w-full p-2 border rounded" />
        <textarea name="description" placeholder="Descrição detalhada (SEO)" rows={4} className="w-full p-2 border rounded" />
        <input name="price" type="number" step="0.01" placeholder="Preço (opcional)" className="w-full p-2 border rounded" />

        <select name="type" required className="w-full p-2 border rounded">
          <option value="">Tipo do Produto</option>
          <option value="digital">Digital (Hotmart)</option>
          <option value="affiliate">Físico (Shopee)</option>
        </select>

        <input name="affiliate_url" type="url" placeholder="Link de Afiliado (Hotmart ou Shopee)" required className="w-full p-2 border rounded" />

        <input name="file" type="file" accept="image/*" required className="w-full p-2 border rounded" />

        <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 disabled:opacity-50">
          {loading ? 'Cadastrando...' : 'Cadastrar Produto'}
        </button>
        {message && <p className="text-center mt-4">{message}</p>}
      </form>
    </div>
  );
}