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
  env: {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
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
