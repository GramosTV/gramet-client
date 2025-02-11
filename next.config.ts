import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();
const nextConfig = {
  images: {
    domains: ['localhost', process.env.API_HOSTNAME || ''],
  },
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  // In order to avoid the 2mb cache limit
  cacheHandler: require.resolve('next/dist/server/lib/incremental-cache/file-system-cache.js'),
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL}/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
