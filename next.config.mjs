/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/:subdomain',
          destination: '/',
        },
      ];
    },
  };
  
  export default nextConfig;