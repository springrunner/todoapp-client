import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    target: 'modules',
    minify: false,
    rollupOptions: {
      input: {
        root: resolve(__dirname, 'index.html'),
        todos: resolve(__dirname, 'pages/todos.html'),
      },
    }
  },
})