// app/(public)/blog-bora-haus/BlogClient.tsx
'use client';

import ArticleCarousel from '@/app/components/blog-components/ArticleCarousel';
import Button from '@/app/components/blog-components/Button';
import ErrorMessage from '@/app/components/blog-components/ErrorMessage';
import LoadingSkeleton from '@/app/components/blog-components/LoadingSkeleton';
import { useArticles } from '@/app/hooks/useArticles';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function BlogClient() {
  const { articles, isLoading, error, addArticle } = useArticles();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await addArticle();
      toast.success('📝 Artigo gerado com sucesso!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Falha ao gerar artigo';
      toast.error(`Falha ao gerar: ${message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  if (error && articles.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ErrorMessage
          error={error.message || 'Erro ao carregar artigos'}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-white">📰 Blog Bora Haus – K-pop</h1>
        <Button onClick={handleGenerate} isLoading={isGenerating}>
          ➕ Gerar Artigo Agora
        </Button>
      </header>

      {error && articles.length > 0 && (
        <ErrorMessage
          error={error.message || 'Erro ao atualizar artigos'}
          onRetry={() => window.location.reload()}
        />
      )}

      {isLoading ? <LoadingSkeleton /> : <ArticleCarousel articles={articles} />}
    </div>
  );
}