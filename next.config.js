/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Resolve canvas dependency issue
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;

    // Handle PDF.js worker
    config.module.rules.push({
      test: /pdf\.worker\.(min\.)?js/,
      type: "asset/resource",
      generator: {
        filename: "static/worker/[hash][ext][query]",
      },
    });

    // Ignore canvas dependency in react-pdf
    config.externals = [...(config.externals || []), { canvas: "canvas" }];

    return config;
  },
  // Allow loading resources from unpkg.com and cdnjs.cloudflare.com
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unpkg.com",
      },
      {
        protocol: "https",
        hostname: "cdnjs.cloudflare.com",
      },
    ],
  },
};

module.exports = nextConfig;
