// app/components/ArticleList.tsx
'use client';

import { Article } from '../../types';
import ArticleCard from './ArticleCard';

interface ArticleListProps {
  articles: Article[];
}

export default function ArticleList({ articles }: ArticleListProps) {
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12">
        <p>Nenhum artigo encontrado.</p>
        <p className="text-sm mt-2">Clique no botão acima para gerar o primeiro!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}