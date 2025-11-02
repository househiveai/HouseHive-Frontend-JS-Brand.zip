/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: 'https://househive-backend.onrender.com',
  },
  images: {
    domains: ['househive-backend.onrender.com'],
  },
};

module.exports = nextConfig;
