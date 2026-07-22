export interface Product {
  id: string;
  name: string;
  description: string;
  price: number | null;
  type: 'digital' | 'affiliate';
  affiliate_url: string;
  image_url: string;
  clicks_total: number;
  created_at: string;
  badge?: 'Pré-venda' | 'Esgotando' | 'Edição Limitada' | 'POB Exclusivo'; // 👈 adicione esta linha
}