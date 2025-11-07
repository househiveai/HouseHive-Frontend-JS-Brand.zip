/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: 'https://househive-backend-v3.onrender.com',
  },
  images: {
    domains: ['househive-backend-v3.onrender.com'],
  },
};

module.exports = nextConfig;
