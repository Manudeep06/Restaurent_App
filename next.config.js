/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['firebase'],
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
