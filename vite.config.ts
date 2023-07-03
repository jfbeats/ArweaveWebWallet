import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { createHtmlPlugin } from 'vite-plugin-html'
import { viteSingleFile } from "vite-plugin-singlefile"
import inject from '@rollup/plugin-inject'
import svgLoader from 'vite-svg-loader'
import pwaOptions from './pwaOptions.ts'
import { buildTypes } from './build.ts'
import { buildMeta } from './edge/meta.ts'
import { resolve } from 'node:path'

declare global { interface Window { BASE_URL: string } }

export default defineConfig(async (config) => {
	const { command, mode } = config
	const env = { ...process.env, ...loadEnv(mode, process.cwd()) } as { [key: string]: string }
	const singleFile = (() => {
		if (mode !== 'file') { return }
		env.BASE_URL = './'
		return viteSingleFile({ removeViteModuleLoader: true })
	})()



	if (mode === 'edge') { return {
		resolve: { alias: { '@': resolve(__dirname, 'src') } },
		define: {
			'process.env': {},
			'window.BASE_URL': JSON.stringify(env.BASE_URL),
		},
		plugins: [
			vue(),
			VitePWA({ ...pwaOptions(env), disable: true }),
		],
		build: {
			// target: 'esnext',
			minify: false,
			outDir: 'netlify/edge-functions/',
			lib: {
				name: 'edge',
				entry: resolve(__dirname, 'edge/netlify.ts'),
				formats: ['es'],
				fileName: format => 'edge.js',
			},
			copyPublicDir: false,
			rollupOptions: {
				plugins: [
					inject({ include: ['node_modules/@ledgerhq/**'], modules: { Buffer: ['buffer', 'Buffer'], } }),
					inject({ exclude: ['node_modules/**', 'scripts/**'], modules: {
						document: ['@/../edge/globals.ts', 'document'],
					} }),
				],
				output: {
					chunkFileNames: 'assets/[name]-[hash].js',
				},
			},
		},
	} }



	return {
		resolve: { alias: { '@': resolve(__dirname, 'src') } },
		define: {
			'process.env': {},
			'window.BASE_URL': JSON.stringify(env.BASE_URL),
		},
		base: env.BASE_URL ?? '/',
		plugins: [
			vue(),
			createHtmlPlugin({ inject: { data: { VITE_META: buildMeta(env) } }, minify: {
				ignoreCustomComments: [/<!-- \/?DATA -->/],
				minifyCSS: true,
				minifyJS: true,
				collapseWhitespace: true,
				preserveLineBreaks: true,
			} }),
			svgLoader({ svgoConfig: { multipass: true } }),
			VitePWA(pwaOptions(env)),
			singleFile,
			buildTypes,
			// { name: "singleHMR", handleHotUpdate({ modules }) {
			// 	modules.map((m) => { m.importedModules = new Set(); m.importers = new Set(); })	  
			// 	return modules;
			// } },
		],
		build: {
			target: 'esnext',
			sourcemap: true,
			rollupOptions: {
				plugins: [
					inject({ include: ['node_modules/@ledgerhq/**'], modules: { Buffer: ['buffer', 'Buffer'], } }),
				],
			},
		},
		server: { port: 8080, https: false },
	}
})