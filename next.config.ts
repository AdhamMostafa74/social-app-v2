import type { NextConfig } from "next";

const nextConfig: NextConfig = {

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev",
                pathname: "/**",

            },
            {
                protocol: "https",
                hostname: "i.pravatar.cc",
                pathname: "/**",

            },
        ],
    },

    async redirects() {
        return [
            {
                source: '/',
                destination: '/home',
                permanent: false,
            },
        ]
    },
}


export default nextConfig;
