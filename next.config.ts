/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 🔥 REMOVIDO: `domains` (deprecated)
    // Agora usamos apenas `remotePatterns` (mais seguro e granular)
    remotePatterns: [
      // 🔹 Localhost (desenvolvimento)
      {
        protocol: "http",
        hostname: "localhost",
        port: "3334", // se sua API rodar em porta diferente, ajuste
        pathname: "/**",
      },
      // 🔹 Backend hospedado no Render (produção)
      {
        protocol: "https",
        hostname: "backend-bora-haus.onrender.com",
        port: "",
        pathname: "/**",
      },
      // 🔹 Supabase (produtos)
      {
        protocol: "https",
        hostname: "inxltoftznrlihdmgwui.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/products/**",
      },
      // 🔹 Unsplash (depoimentos)
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      // 🔹 Pravatar (avatares das avaliações)
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        port: "",
        pathname: "/**",
      },
    ],
    // Formatos modernos para melhor performance
    formats: ["image/avif", "image/webp"],
  },
  env: {
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  },
};

export default nextConfig;