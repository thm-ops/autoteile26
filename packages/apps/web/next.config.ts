import type { NextConfig } from "next";
import path from "path";

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
