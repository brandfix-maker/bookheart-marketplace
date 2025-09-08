/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@bookheart/shared'],
  images: {
    domains: ['res.cloudinary.com', 'localhost'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
