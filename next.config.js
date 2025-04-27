/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'solo-leveling-arise.vercel.app'],
  },
  async beforeBuild() {
    if (process.env.INIT_DB === 'true') {
      const { initializeAdmin } = require('./lib/initDB');
      await initializeAdmin();
    }
  }
};

module.exports = nextConfig;
