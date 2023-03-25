import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { createHtmlPlugin } from 'vite-plugin-html'
import { viteSingleFile } from "vite-plugin-singlefile"
import inject from '@rollup/plugin-inject'
import svgLoader from 'vite-svg-loader'
import pwaOptions from './pwaOptions.js'
import { buildTypes } from './build.js'

declare global { interface Window { BASE_URL: string } }

export default async (config: any) => {
	const { command, mode } = config
	const env = { ...process.env, ...loadEnv(mode, process.cwd()) }
	
	const singleFile = (() => {
		if (mode !== 'file') { return }
		env.BASE_URL = './'
		return viteSingleFile({ removeViteModuleLoader: true })
	})()
	
	return defineConfig({
		base: env.BASE_URL ?? '/',
		plugins: [
			vue(),
			createHtmlPlugin({ inject: { data: { ...env } }, minify: true }),
			svgLoader({ svgoConfig: { multipass: true } }),
			VitePWA(pwaOptions(env)),
			singleFile,
			buildTypes,
		],
		resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
		build: { target: 'esnext', sourcemap: true, rollupOptions: { plugins: [
			inject({ include: ['node_modules/@ledgerhq/**'], modules: { Buffer: ['buffer', 'Buffer'], } }),
		] } },
		server: { port: 8080, https: false },
		define: {
			'process.env': {},
			'window.BASE_URL': JSON.stringify(env.BASE_URL)
		},
	})
}