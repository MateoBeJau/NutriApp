import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Ignorar errores de ESLint durante build
  },
  typescript: {
    ignoreBuildErrors: false, // Mantener validación de TypeScript
  },
};

export default nextConfig;
