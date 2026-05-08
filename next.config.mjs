/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  transpilePackages: ['@react-pdf/renderer'],
  output: 'standalone',
  async redirects() {
    return [
      { source: '/psicometrias/test/fallback-luscher', destination: '/psicometrias/luscher', permanent: true },
      { source: '/psicometrias/test/fallback-allport', destination: '/psicometrias/allport', permanent: true },
      { source: '/psicometrias/test/fallback-moss', destination: '/psicometrias/moss', permanent: true },
      { source: '/psicometrias/test/fallback-zavic', destination: '/psicometrias/zavic', permanent: true },
      { source: '/psicometrias/test/fallback-kostick', destination: '/psicometrias/kostick', permanent: true },
      { source: '/psicometrias/test/fallback-raven', destination: '/psicometrias/raven', permanent: true },
      { source: '/psicometrias/test/fallback-terman', destination: '/psicometrias/terman', permanent: true },
      { source: '/psicometrias/test/fallback-16pf', destination: '/psicometrias/16pf', permanent: true },
      { source: '/psicometrias/test/fallback-mmpi', destination: '/psicometrias/mmpi', permanent: true },
    ];
  },
};

export default nextConfig;
