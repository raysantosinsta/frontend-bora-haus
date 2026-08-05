'use client';

import { useEffect, useState } from 'react';

interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  image_path: string | null;
  status: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3334';

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/articles`);
      if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
      const data = await res.json();
      setArticles(data);
    } catch (err: any) {
      console.error('Erro ao carregar artigos:', err);
      setError(`Não foi possível conectar ao backend: ${err.message}. Verifique se o servidor está rodando na porta 3334.`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateArticle = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/articles/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
      const newArticle = await res.json();
      setArticles((prev) => [newArticle, ...prev]);
      alert('Artigo gerado com sucesso!');
    } catch (err: any) {
      console.error('Erro ao gerar artigo:', err);
      setError(`Falha ao gerar artigo: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <h1>📰 Blog Bora Haus – K-pop</h1>
        <button
          onClick={handleGenerateArticle}
          disabled={generating}
          style={{
            padding: '0.6rem 1.2rem',
            backgroundColor: generating ? '#ccc' : '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: generating ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
          }}
        >
          {generating ? 'Gerando...' : '➕ Gerar Artigo Agora'}
        </button>
      </header>

      {loading && <p>Carregando artigos...</p>}

      {error && (
        <div style={{ backgroundColor: '#fee', color: '#c00', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <strong>Erro:</strong> {error}
          <br />
          <button onClick={fetchArticles} style={{ marginTop: '0.5rem', padding: '0.3rem 0.8rem', cursor: 'pointer' }}>
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !error && articles.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666' }}>
          Nenhum artigo encontrado. Clique no botão para gerar o primeiro!
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {articles.map((article) => (
          <article
            key={article.id}
            style={{
              border: '1px solid #eaeaea',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            {article.image_path && (
              <img
                src={`${API_URL}/public/${article.image_path}`} // ou use a URL do Supabase
                alt={article.title}
                style={{
                  width: '100%',
                  maxHeight: '400px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                }}
              />
            )}
            <h2 style={{ margin: '0 0 0.5rem' }}>{article.title}</h2>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              <strong>Categoria:</strong> {article.category} &nbsp;|&nbsp;
              <strong>Publicado em:</strong> {new Date(article.published_at).toLocaleDateString('pt-BR')}
            </p>
            <p style={{ fontStyle: 'italic', color: '#555' }}>{article.summary}</p>
            <div
              dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }}
              style={{ lineHeight: '1.8', marginTop: '1rem' }}
            />
            <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    backgroundColor: '#f0f0f0',
                    padding: '0.2rem 0.8rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}