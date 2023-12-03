import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({command, mode})=>{
  const env = loadEnv(mode, process.cwd(), '');
  return {
    // define: {
    //   _APP_ENV__: JSON.stringify(env.VITE_ALCHEMY_API_KEY),
    // },
    build: {
     target: 'es2020',
    },
    plugins: [react()],
  }
})
