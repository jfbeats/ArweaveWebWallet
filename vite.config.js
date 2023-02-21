import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { createHtmlPlugin } from 'vite-plugin-html'
import inject from '@rollup/plugin-inject'
import svgLoader from 'vite-svg-loader'
import pwaOptions from './pwaOptions.ts'

export default async ({ command, mode  }) => {
	const env = { ...process.env, ...loadEnv(mode, process.cwd()) }

	return defineConfig({
		base: env.BASE_URL ?? env.VITE_BASE_URL ?? '/',
		plugins: [
			vue(),
			createHtmlPlugin({ inject: { data: { ...env } }, minify: true }),
			svgLoader({ svgoConfig: { multipass: true } }),
			VitePWA(pwaOptions(env)),
		],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, 'src'),
			}
		},
		build: {
			target: 'esnext',
			sourcemap: true,
			rollupOptions: {
				plugins: [
					inject({
						include: ['node_modules/@ledgerhq/**'],
						modules: { Buffer: ['buffer', 'Buffer'], }
					}),
				],
			},
		},
		server: {
			port: 8080,
			https: false,
		},
		define: { 'process.env': {} },
	})
}
