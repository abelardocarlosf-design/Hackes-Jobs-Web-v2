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
  // @react-pdf/renderer necesita el build completo de React (usa React.Component).
  // Bundlearlo deja `react` resuelto al build de servidor, que no lo expone.
  experimental: {
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
  },
  output: 'standalone',
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https:; frame-src 'self' https://accounts.google.com;",
          },
        ],
      },
    ];
  },
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

