import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const unipileDsn = env.VITE_UNIPILE_BASE_URL || 'https://api38.unipile.com:16809'

  const unipileProxy = {
    '/unipile': {
      target: unipileDsn,
      changeOrigin: true,
      secure: true,
      rewrite: (path) => path.replace(/^\/unipile/, ''),
    },
  }

  return {
    plugins: [react()],
    server: { proxy: unipileProxy },
    preview: { proxy: unipileProxy },
  }
})
