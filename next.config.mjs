/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  // Host-based rewrites. This is what makes goldstay.co.ke serve the
  // Nairobi city page and goldstay.com.gh serve the Accra city page at
  // the root path. These run at Vercel's edge router before static
  // serving, so they work reliably even though / and /nairobi are both
  // pre-rendered at build time. Middleware was flaky here because
  // Vercel will cache the static / response per host once served, and
  // then middleware never runs again. Config-level rewrites do not hit
  // that footgun.
  async rewrites() {
    const kenyaHosts = ["goldstay.co.ke", "www.goldstay.co.ke"];
    const ghanaHosts = ["goldstay.com.gh", "www.goldstay.com.gh"];

    const hostRewrite = (hosts, destination) =>
      hosts.map((value) => ({
        source: "/",
        has: [{ type: "host", value }],
        destination,
      }));

    return {
      beforeFiles: [
        ...hostRewrite(kenyaHosts, "/nairobi"),
        ...hostRewrite(ghanaHosts, "/accra"),
      ],
    };
  },
};

export default nextConfig;
