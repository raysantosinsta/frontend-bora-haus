// app/components/blog-components/ArticleViewer.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Article } from '../../types';
import { sanitizeHTML } from '../../lib/sanitize';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3334';

interface ArticleViewerProps {
  article: Article;
  isActive: boolean;
}

export default function ArticleViewer({ article, isActive }: ArticleViewerProps) {
  const [imageError, setImageError] = useState(false);

  const tags = article.tags ?? [];
  const content = article.content ?? '';
  const publishedAt = article.published_at ? new Date(article.published_at) : null;

  return (
    <article
      className={`
        max-w-4xl mx-auto px-5 sm:px-8 lg:px-10 py-8 sm:py-14
        transition-opacity duration-500 ease-out
        ${isActive ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}
      `}
      role="article"
      aria-label={`Artigo: ${article.title}`}
    >
      {/* Imagem de capa premium */}
      {article.image_path && !imageError && (
        <div className="relative w-full aspect-[16/9] mb-12 sm:mb-16 overflow-hidden rounded-3xl shadow-2xl shadow-black/40 bg-zinc-900 ring-1 ring-white/10">
          <Image
            src={`${API_URL}/images/${article.image_path}`}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-700 hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 80vw"
            onError={() => setImageError(true)}
            priority={isActive}
            loading={isActive ? 'eager' : 'lazy'}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCgAA//2Q=="
          />
          {/* Overlay sutil no rodapé da imagem */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </div>
      )}

      {/* Header */}
      <header className="mb-10 sm:mb-14 space-y-6">
        <h1
          className="
            font-bold text-white
            text-[clamp(2.75rem,1.8rem+4.5vw,5.25rem)]
            leading-[1.02] tracking-[-0.03em]
            max-w-[18ch]
          "
        >
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[clamp(1.05rem,0.95rem+0.45vw,1.3rem)] text-zinc-400">
          {article.category && (
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              <span className="font-medium text-zinc-300">{article.category}</span>
            </span>
          )}
          {publishedAt && (
            <time dateTime={article.published_at} className="text-zinc-500">
              {publishedAt.toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
          )}
        </div>
      </header>

      {/* Resumo / Lead */}
      {article.summary && (
        <p
          className="
            text-zinc-300 border-l-[3px] border-violet-500 pl-7 mb-12 sm:mb-16
            text-[clamp(1.45rem,1.15rem+1.2vw,2.05rem)]
            leading-[1.5] tracking-[-0.01em] font-medium
          "
        >
          {article.summary}
        </p>
      )}

      {/* Conteúdo principal — tipografia grande e premium */}
      <div
        className="
          prose prose-invert max-w-[72ch]
          prose-headings:text-white prose-headings:font-bold prose-headings:tracking-[-0.02em]

          /* Parágrafos */
          prose-p:text-zinc-200
          prose-p:text-[clamp(1.2rem,1.05rem+0.7vw,1.6rem)]
          prose-p:leading-[1.8]
          prose-p:mb-8

          /* Links */
          prose-a:text-violet-400 prose-a:underline prose-a:decoration-violet-400/40
          prose-a:underline-offset-[5px] prose-a:font-medium
          hover:prose-a:decoration-violet-300 hover:prose-a:text-violet-300
          transition-colors

          /* Ênfases */
          prose-strong:text-white prose-strong:font-semibold
          prose-em:text-zinc-300

          /* Listas */
          prose-li:text-zinc-200
          prose-li:text-[clamp(1.2rem,1.05rem+0.7vw,1.6rem)]
          prose-li:leading-[1.8]
          prose-ul:my-8 prose-ol:my-8
          prose-li:my-3.5
          prose-ul:list-disc prose-ul:pl-8
          prose-ol:list-decimal prose-ol:pl-8

          /* Headings */
          prose-h2:text-[clamp(2rem,1.6rem+1.8vw,3rem)]
          prose-h2:leading-[1.15] prose-h2:mt-20 prose-h2:mb-7
          prose-h2:tracking-[-0.025em]

          prose-h3:text-[clamp(1.65rem,1.35rem+1.2vw,2.3rem)]
          prose-h3:leading-[1.2] prose-h3:mt-14 prose-h3:mb-6

          prose-h4:text-[clamp(1.35rem,1.15rem+0.8vw,1.75rem)]
          prose-h4:leading-[1.25] prose-h4:mt-12 prose-h4:mb-5

          /* Imagens dentro do conteúdo */
          prose-img:rounded-2xl prose-img:shadow-xl prose-img:my-12
          prose-img:ring-1 prose-img:ring-white/10

          /* Blockquotes */
          prose-blockquote:text-[clamp(1.35rem,1.1rem+1vw,1.9rem)]
          prose-blockquote:border-l-[3px] prose-blockquote:border-violet-500
          prose-blockquote:pl-7 prose-blockquote:italic prose-blockquote:text-zinc-300
          prose-blockquote:leading-[1.65] prose-blockquote:my-12
          prose-blockquote:font-medium

          /* Código */
          prose-code:text-violet-300 prose-code:bg-zinc-800/80
          prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md
          prose-code:text-[0.9em] prose-code:font-medium
          prose-pre:bg-zinc-900 prose-pre:rounded-2xl prose-pre:p-6
          prose-pre:shadow-lg prose-pre:ring-1 prose-pre:ring-white/5

          /* HR */
          prose-hr:border-zinc-700 prose-hr:my-16
        "
        dangerouslySetInnerHTML={{
          __html: sanitizeHTML(content.replace(/\n/g, '<br/>')),
        }}
      />

      {/* Tags */}
      {tags.length > 0 && (
        <footer className="mt-16 sm:mt-20 pt-10 border-t border-zinc-800">
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="
                  bg-zinc-800/60 text-zinc-300 
                  px-4 py-2 rounded-full text-[0.95rem] font-medium 
                  border border-zinc-700/80
                  hover:bg-zinc-700/60 hover:border-zinc-600 
                  transition-colors duration-200
                "
              >
                #{tag}
              </span>
            ))}
          </div>
        </footer>
      )}
    </article>
  );
}