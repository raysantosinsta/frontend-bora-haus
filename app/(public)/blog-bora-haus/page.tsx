// app/(public)/blog-bora-haus/page.tsx
import BlogClient from './BlogClient';

export const metadata = {
  title: 'Blog Bora Haus – K-pop',
  description: 'Artigos sobre K-pop, tendências e novidades.',
  openGraph: {
    title: 'Blog Bora Haus – K-pop',
    description: 'Artigos sobre K-pop, tendências e novidades.',
    url: 'https://meusite.com/blog',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Bora Haus – K-pop',
    description: 'Artigos sobre K-pop, tendências e novidades.',
  },
};

export default function BlogPage() {
  return <BlogClient />;
}