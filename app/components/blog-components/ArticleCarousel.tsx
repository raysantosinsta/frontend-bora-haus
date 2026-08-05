// app/components/blog-components/ArticleCarousel.tsx
'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import type { Article } from '../../types';
import ArticleViewer from './ArticleViewer';
import Button from './Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ArticleCarouselProps {
  articles: Article[];
}

export default function ArticleCarousel({ articles }: ArticleCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev' | null>(null);

  const total = articles.length;

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= total) return;
      setDirection(index > currentIndex ? 'next' : 'prev');
      setCurrentIndex(index);
    },
    [currentIndex, total]
  );

  const goNext = useCallback(() => goTo(currentIndex + 1), [goTo, currentIndex]);
  const goPrev = useCallback(() => goTo(currentIndex - 1), [goTo, currentIndex]);

  // Pré-carregar imagens dos artigos adjacentes
  useEffect(() => {
    const preloadImage = (index: number) => {
      const article = articles[index];
      if (!article?.image_path) return;
      const img = new window.Image();
      img.src = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3334'}/images/${article.image_path}`;
    };
    if (currentIndex + 1 < total) preloadImage(currentIndex + 1);
    if (currentIndex - 1 >= 0) preloadImage(currentIndex - 1);
  }, [currentIndex, articles]);

  // Teclado: setas esquerda/direita
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev]);

  if (total === 0) {
    return (
      <div className="text-center text-gray-400 py-20">
        <p className="text-2xl">Nenhum artigo encontrado.</p>
        <p className="mt-2">Clique em "Gerar Artigo Agora" para começar.</p>
      </div>
    );
  }

  const currentArticle = articles[currentIndex];

  return (
    <div className="relative w-full">
      {/* Container do artigo com altura mínima para evitar saltos */}
      <div className="relative min-h-[70vh]">
        {articles.map((article, index) => (
          <ArticleViewer
            key={article.id}
            article={article}
            isActive={index === currentIndex}
          />
        ))}
      </div>

      {/* Controles de navegação */}
      <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-700">
        <div className="flex items-center gap-2">
          <Button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="bg-transparent hover:bg-gray-700 text-white border border-gray-600 px-4 py-2 rounded-full flex items-center gap-1"
          >
            <ChevronLeft size={20} />
            <span className="hidden sm:inline">Anterior</span>
          </Button>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>
            {currentIndex + 1} de {total}
          </span>
          {/* Barra de progresso */}
          <div className="w-24 sm:w-32 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={goNext}
            disabled={currentIndex === total - 1}
            className="bg-transparent hover:bg-gray-700 text-white border border-gray-600 px-4 py-2 rounded-full flex items-center gap-1"
          >
            <span className="hidden sm:inline">Próximo</span>
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}