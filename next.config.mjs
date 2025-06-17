/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'nikah-sufiyana-matrimonial-git-main-iamrayhansufis-projects.vercel.app',
          },
        ],
        destination: 'https://nikahsufiyana.com/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
