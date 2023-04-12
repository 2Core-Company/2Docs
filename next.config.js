/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['firebasestorage.googleapis.com'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    appDir: true,
    optimizeFonts: true, // aqui está a propriedade optimizeFonts dentro de experimental
    fontLoaders: [
      { loader: '@next/font/google' },
    ],
  },
}

module.exports = nextConfig;
