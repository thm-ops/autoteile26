import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "placeholder.co",
                pathname: "/**"
            }
        ]
    }
};

export default nextConfig;
