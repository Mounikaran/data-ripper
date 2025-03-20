/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  // Increase the memory limit for the build process
  experimental: {
    memoryBasedWorkersCount: true,
    serverComponentsExternalPackages: ['xlsx', 'jszip'],
  },
  // Increase API body size limit for file uploads (100MB)
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
    responseLimit: '100mb',
  },
  // Increase webpack buffer limit for large files
  webpack: (config) => {
    config.performance = {
      ...config.performance,
      maxAssetSize: 1024 * 1024 * 100, // 100MB
      maxEntrypointSize: 1024 * 1024 * 100, // 100MB
    };
    return config;
  },
};

module.exports = nextConfig;
