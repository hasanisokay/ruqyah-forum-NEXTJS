/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
    ],
  },
  
  // Prerender configuration
  prerender: {
    initialStatus: 200, // Set to a valid HTTP status code
    // Add any other prerender options if needed
  },
}

module.exports = nextConfig
