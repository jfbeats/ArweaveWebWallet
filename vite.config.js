import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import inject from '@rollup/plugin-inject'

export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		}
	},
	build: {
		rollupOptions: {
			plugins: [
				inject({ Buffer: [ 'Buffer', 'Buffer'] })
			],
		},
	},
})
