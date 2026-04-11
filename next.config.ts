import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'standalone',
    headers: async () => [
        {
            source: '/(.*)',
            headers: [
                {
                    key: 'Cross-Origin-Opener-Policy',
                    value: 'same-origin-allow-popups',
                },
            ],
        },
    ],
};

export default nextConfig;
