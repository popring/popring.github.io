import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  reactCompiler: true,
  experimental: {
    // React Compiler 的原生 Rust 实现，跑在 Turbopack 里而不是绕 Node.js 的 Babel。
    // 开了它就不需要 babel-plugin-react-compiler 依赖（已移除）。16.3 起可用，仍是 experimental。
    turbopackRustReactCompiler: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'log.660066.xyz',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
