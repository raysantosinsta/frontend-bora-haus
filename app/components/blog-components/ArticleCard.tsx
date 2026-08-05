// app/components/blog-components/ArticleCard.tsx
import Image from 'next/image';
import { useState } from 'react';
import type { Article } from '../../types';
import { sanitizeHTML } from '../../lib/sanitize';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3334';

export default function ArticleCard({ article }: { article: Article }) {
  const [imageError, setImageError] = useState(false);

  const tags = article.tags ?? [];
  const content = article.content ?? '';
  const publishedAt = article.published_at ? new Date(article.published_at) : null;

  return (
    <article
      className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow bg-white"
      role="article"
      aria-label={`Artigo: ${article.title}`}
    >
      {article.image_path && !imageError && (
        <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
          <Image
            src={`${API_URL}/images/${article.image_path}`}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
            priority={false}
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCgAA//2Q=="
          />
        </div>
      )}

      <h2 className="text-xl font-bold mb-1 text-gray-900">{article.title}</h2>

      <div className="text-sm text-gray-600 mb-2">
        {article.category && (
          <>
            <span className="font-medium">Categoria:</span> {article.category} &nbsp;|&nbsp;
          </>
        )}
        {publishedAt && (
          <time dateTime={article.published_at}>
            {publishedAt.toLocaleDateString('pt-BR')}
          </time>
        )}
      </div>

      {article.summary && (
        <p className="text-gray-700 italic mb-3">{article.summary}</p>
      )}

      <div
        className="prose prose-sm max-w-none text-gray-800"
        dangerouslySetInnerHTML={{
          __html: sanitizeHTML(content.replace(/\n/g, '<br/>')),
        }}
      />

      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}