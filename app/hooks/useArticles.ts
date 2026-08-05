// app/hooks/useArticles.ts
'use client';

import useSWR from 'swr';
import type { Article } from '../types';
import { fetchArticles, generateArticle } from '../lib/api';

export function useArticles() {
  const { data, error, mutate, isLoading } = useSWR<Article[]>(
    '/articles',
    fetchArticles,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  const addArticle = async () => {
    const newArticle = await generateArticle();
    // Atualiza cache otimisticamente, sem revalidar antes de confirmar
    await mutate((current) => [newArticle, ...(current ?? [])], false);
    return newArticle;
  };

  return {
    articles: data ?? [],
    isLoading,
    error,
    addArticle,
    mutate,
  };
}