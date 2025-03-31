// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   eslint: {
//     ignoreDuringBuilds: true, // Skips ESLint checks during next build
//   },
// };

// module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // Ignores ESLint errors during build
  },
};

module.exports = nextConfig;