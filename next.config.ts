import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Images from external providers
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google avatars
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" }, // Vercel Blob
    ],
  },
  // Disable x-powered-by header
  poweredByHeader: false,
}

export default nextConfig
