/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ['page.tsx', 'api.ts', 'api.tsx']//td arquivo criado dentro do next vira rota, fazendo dessa forma só arquivos com esse final vao ser lidos como rota
}

module.exports = nextConfig
