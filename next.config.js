/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['gen.pollinations.ai', 'image.pollinations.ai'],
  },
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
}

module.exports = nextConfig
