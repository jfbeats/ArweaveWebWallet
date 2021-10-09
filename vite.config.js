import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import processHtml from 'vite-plugin-html'
import inject from '@rollup/plugin-inject'

export default ({ mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

	return defineConfig({
		plugins: [
			vue(),
			processHtml({ inject: {data: { ...process.env }}, minify: true }),
			VitePWA({
				manifest: {
					name: process.env.VITE_TITLE,
					short_name: process.env.VITE_TITLE,
					description: process.env.VITE_DESCRIPTION,
					theme_color: process.env.VITE_BACKGROUND,
					background_color: process.env.VITE_BACKGROUND,
					display: 'standalone',
					start_url: '.',
					icons: [
						{
							src: 'arweave.svg',
							type: 'image/svg+xml',
							sizes: 'any',
							purpose: 'monochrome any',
						},
						{
							src: 'arweave-192.png',
							type: 'image/png',
							sizes: '192x192',
							purpose: 'monochrome any',
						},
						{
							src: 'arweave-512.png',
							type: 'image/png',
							sizes: '512x512',
							purpose: 'monochrome any',
						}
					]
				}
			})
		],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, 'src'),
			}
		},
		build: {
			rollupOptions: {
				plugins: [inject({ Buffer: ['Buffer', 'Buffer'] })],
			},
		},
		server: {
			port: 8080,
			https: false,
		}
	})
}
