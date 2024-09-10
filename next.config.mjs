/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      'static.www.nfl.com',
      'sleepercdn.com',
      'sleeper.app',
      'a.espncdn.com',
    ],
  },
}
export default nextConfig
