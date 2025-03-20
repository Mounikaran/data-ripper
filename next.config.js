/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  // Increase the memory limit for the build process
  experimental: {
    // Adjust as needed
    memoryBasedWorkersCount: true,
  },
};

module.exports = nextConfig;
