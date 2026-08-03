import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 'standalone' is for Docker/self-hosted deployments only.
  // Vercel uses its own serverless pipeline and does not need standalone output.
  // Set NEXT_STANDALONE=true in Docker build args to enable it.
  ...(process.env.NEXT_STANDALONE === 'true' ? { output: 'standalone' } : {}),
};

export default nextConfig;
