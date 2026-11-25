
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    turbopack: {
        rules: {
            "*.css": {
                loaders: ["@tailwindcss/turbopack"],
                as: "*.css",
            },
        },
    },

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                pathname: "/ijicg2c7/**",
            },
        ],
    },
};

export default nextConfig;
