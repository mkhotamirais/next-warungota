import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        // port: "",
        // pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "9xlz2yuk4kbpfquu.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
