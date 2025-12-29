/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['firebase'],
  images: {
    domains: [
      'images.unsplash.com',
      'source.unsplash.com',
      'placehold.co',
      'firebasestorage.googleapis.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules[\\/]undici/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
        },
      },
    });
    return config;
  },
};

module.exports = nextConfig;
