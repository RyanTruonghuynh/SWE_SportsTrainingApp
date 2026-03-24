import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        test: {
          name: 'backend',
          include: ['tests/backend/**/*.test.js'],
          environment: 'node',
          globals: true,
          setupFiles: './tests/setup.js',
        },
      },
      {
        test: {
          name: 'frontend',
          include: ['tests/frontend/**/*.test.jsx'],
          environment: 'jsdom',
          globals: true,
          setupFiles: './tests/setup.js',
        },
      },
    ],
  },
})
