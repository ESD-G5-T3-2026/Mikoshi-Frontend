import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true, // listen on all interfaces
    port: 6620,
    strictPort: true,
    allowedHosts: [
      'mikoshi.centralindia.cloudapp.azure.com', // your Azure hostname
      '135.235.140.36',
      '127.0.0.1'
    ]
  }
});
