export interface Product {
  id: string;
  name: string;
  description: string;
  price: number | null;
  type: "digital" | "affiliate";
  affiliate_url: string;
  image_path: string;
  image_url: string;
  images: string[]; // 👈 novo campo
  clicks_total: number;
  created_at: string;
  categoria: string;
}

// types/index.ts
export interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  image_path: string | null;
  status: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}