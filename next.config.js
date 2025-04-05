/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
      appDir: true, // Ensures App Router support (already enabled in 15.2.4)
    },
  };
  
  module.exports = nextConfig;