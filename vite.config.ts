import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { defineConfig, loadEnv, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs-extra";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  function copyAssetsForAndroid(): Plugin {
    return {
      name: "copy-assets-for-android",
      closeBundle: async () => {
        if (env.VITE_PLATFORM === "android") {
          const srcDir = resolve(__dirname, "public", "assets");
          const destDir = resolve(__dirname, "dist", "assets");

          if (fs.existsSync(srcDir)) {
            await fs.copy(srcDir, destDir);
            console.log(`✅ Copiado: ${srcDir} → ${destDir}`);
          } else {
            console.warn(`⚠️ Diretório de assets não encontrado: ${srcDir}`);
          }
        }
      },
    };
  }

  return {
    plugins: [
      react(),
      copyAssetsForAndroid(),
    ],
    build: {
      target: "esnext",
      minify: "esbuild",
      sourcemap: false,
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    server: {
      port: 8080,
      open: true,
    },
  };
});
