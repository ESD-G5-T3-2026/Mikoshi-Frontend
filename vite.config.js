import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
  server: {
    host: true, // listen on all interfaces
    https: false,
    port: 6620,
    strictPort: true,
    allowedHosts: ["mikoshi.centralindia.cloudapp.azure.com"]
  }
});
