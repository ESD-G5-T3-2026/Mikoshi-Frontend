import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
	plugins: [react(), basicSsl()],
  server: {
    host: true, // listen on all interfaces
    https: true,
    port: 6620,
    strictPort: true,
    allowedHosts: [
      'mikoshi.centralindia.cloudapp.azure.com', // your Azure hostname
      '135.235.140.36',
      '127.0.0.1'
    ]
  }
});
