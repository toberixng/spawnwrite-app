/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
      appDir: true,
    },
    async redirects() {
      return [
        {
          source: '/auth/callback',
          destination: '/auth/sign-in?error=Callback%20failed',
          permanent: false,
          has: [{ type: 'query', key: 'error' }],
        },
      ];
    },
  };
  module.exports = nextConfig;