/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // 🔹 Permite imagens do Supabase (já existente)
      {
        protocol: 'https',
              hostname: 'inxltoftznrlihdmgwui.supabase.co',

        port: '',
        pathname: '/storage/v1/object/public/products/**',
      },
      // 🔹 Permite imagens do Unsplash (novo – para os depoimentos)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;