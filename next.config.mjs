
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
    ],
  },

  experimental: {
    serverActions: { bodySizeLimit: '100mb' },
    serverComponentsExternalPackages: ['sequelize', 'sequelize-typescript'],
  },
};

export default nextConfig;
