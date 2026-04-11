/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Allow LAN devices to load dev assets and connect to the HMR WebSocket.
  // Without this, Next 16 blocks cross-origin requests from 192.168.x.x and
  // other machines see a stale build until they hard-refresh.
  allowedDevOrigins: [
    "192.168.1.*", // wildcard covers any 192.168.1.x device on the LAN
    "172.23.112.1", // Hyper-V / WSL virtual adapter on this machine
    "localhost",
  ],
};

export default nextConfig;
