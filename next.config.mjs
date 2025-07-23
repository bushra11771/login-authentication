/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://auth-login-backend-9kla-bushra11771s-projects.vercel.app/api/:path*',
      },
      {
        source: '/auth/:path*',
        destination: 'https://auth-login-backend-9kla-bushra11771s-projects.vercel.app/auth/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', 
          },
        ],
      },
    ];
  },
};

export default nextConfig;