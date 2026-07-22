import { fetchProduct } from '@/app/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: { params: { id: string } }) {
  try {
    const product = await fetchProduct(params.id);

    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Imagem */}
          <div className="relative h-96 md:h-[500px] w-full bg-gray-100 rounded-xl overflow-hidden">
            <Image src={product.image_url} alt={product.name} fill className="object-contain" />
          </div>

          {/* Informações */}
          <div>
            <span className={`text-sm font-bold px-3 py-1 rounded ${product.type === 'digital' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
              {product.type === 'digital' ? '📘 Produto Digital (Hotmart)' : '📦 Produto Físico (Shopee)'}
            </span>
            <h1 className="text-3xl font-bold mt-4">{product.name}</h1>
            {product.price && <p className="text-2xl font-bold text-purple-700 mt-2">R$ {product.price}</p>}
            <p className="text-gray-600 mt-6 whitespace-pre-line">{product.description}</p>

            {/* Contador de cliques (engajamento) */}
            <p className="text-sm text-gray-400 mt-4">👀 {product.clicks_total} pessoas já clicaram</p>

            {/* Botão de COMPRA - leva para a página de redirecionamento */}
            <Link
              href={`/redirect/${product.id}`}
              className={`mt-8 inline-block w-full text-center text-white text-xl font-bold py-4 rounded-lg transition ${
                product.type === 'digital' ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {product.type === 'digital' ? '🛒 Comprar na Hotmart' : '🛒 Comprar na Shopee'}
            </Link>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}