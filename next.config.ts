/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // 🔹 Supabase (produtos)
      {
        protocol: 'https',
        hostname: 'inxltoftznrlihdmgwui.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/products/**',
      },
      // 🔹 Unsplash (depoimentos)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // 🔹 Pravatar (avatares das avaliações) – NOVO
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  },
};

export default nextConfig;