import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    allowedHosts: [
      '427c-2409-40e5-112e-dab9-e0cd-3ec-315b-5f10.ngrok-free.app'
    ]
  }
});
