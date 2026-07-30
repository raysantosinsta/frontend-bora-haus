// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3334';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number | null;
  type: 'digital' | 'affiliate';
  affiliate_url: string;
  image_path: string;
  image_url: string;
  images: string[];
  clicks_total: number;
  created_at: string;
}

export async function fetchProducts(): Promise<Product[]> {
  console.log('🔍 API_URL =', API_URL);
  console.log('📡 Buscando produtos em:', `${API_URL}/products`);

  const res = await fetch(`${API_URL}/products`, {
    // Cache por 60 segundos, após isso revalida em background
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error('Erro ao buscar produtos');
  return res.json();
}

export async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error('Erro ao buscar produto');
  return res.json();
}

export async function createProduct(data: FormData, apiKey: string): Promise<Product> {
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'x-api-key': apiKey },
    body: data,
  });
  if (!res.ok) throw new Error('Erro ao criar produto');
  return res.json();
}

export async function registerClick(productId: string, destination: 'hotmart' | 'shopee') {
  const res = await fetch(`${API_URL}/clicks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id: productId, destination }),
  });
  if (!res.ok) throw new Error('Erro ao registrar clique');
  return res.json();
}