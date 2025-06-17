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
        destination: 'https://www.nikahsufiyana.com/:path*',
        permanent: true,
      },
      // Do not redirect between www and non-www versions - this prevents redirect loops
      // Let the middleware handle both domains as valid
    ]
  },
}

export default nextConfig
