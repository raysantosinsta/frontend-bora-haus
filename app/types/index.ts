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
}