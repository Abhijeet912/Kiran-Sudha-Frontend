/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Product/banner images uploaded via the admin portal (Cloudinary)
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Local backend-served assets during development
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

export default nextConfig;
