/** @type {import('next').NextConfig} */
const nextConfig = {
  // distDir mantém padrão (.next) — a pasta .next é um junction point
  // apontando para AppData\Local\pipeflow-crm\.next (fora do OneDrive).
  // O script predev em package.json garante que o junction existe sempre.

  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ["**/node_modules/**", "**/.git/**"],
      };
    }
    return config;
  },
};

export default nextConfig;
