/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Helps catch errors during development
  images: {
    domains: ['assets.spawnwrite.com'], // Allows R2-hosted images
  },
  // Optional: Add Sentry if using it
  sentry: {
    hideSourceMaps: true, // Keeps source maps private
  },
};

// Export with Sentry wrapper if installed, otherwise plain config
const withSentry = require('@sentry/nextjs');
module.exports = process.env.SENTRY_DSN ? withSentry(nextConfig) : nextConfig;