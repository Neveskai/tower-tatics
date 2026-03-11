import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "tower.tatics.app",
  appName: "tower-tatics",
  webDir: "dist",
  server:
    process.env.VITE_PLATFORM === "dev"
      ? {
          url: "http://192.168.0.107:8080/",
          cleartext: true,
        }
      : undefined,
  plugins: {
    GoogleAuth: {
      scopes: ["profile", "email"],
      serverClientId: process.env.VITE_GOOGLE_CLIENT_ID,
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
