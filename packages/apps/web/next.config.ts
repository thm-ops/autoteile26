import type { NextConfig } from "next";

// Same-origin API access: the browser only ever talks to the Next server,
// which proxies backend routes to the service. This avoids CORS and a second
// published port. `rewrites()` is baked into routes-manifest.json at build
// time, so API_PROXY_TARGET must be present as a build arg (prod) or in the
// copied .env (dev). Prod: http://service:3000, dev: http://localhost:3001.
const apiProxyTarget = process.env.API_PROXY_TARGET ?? "http://localhost:3001";

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
    },
    async rewrites() {
        // NextAuth lives under /api/auth/* and is deliberately not proxied.
        return [
            { source: "/auth/:path*", destination: `${apiProxyTarget}/auth/:path*` },
            { source: "/payments/:path*", destination: `${apiProxyTarget}/payments/:path*` },
        ];
    },
};

export default nextConfig;
