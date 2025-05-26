/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "pbs.twimg.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "static2.finnhub.io",
                port: "",
                pathname: "/**",
            },
        ],
    },
};

module.exports = nextConfig;
