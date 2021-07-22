const webpack = require('webpack')

module.exports = {
	publicPath: process.env.GITHUB_ACTIONS ? '/' : '',

	productionSourceMap: false, // not source map to production

	configureWebpack: {
		plugins: [
			new webpack.IgnorePlugin({
				resourceRegExp: /^\.\/wordlists\/(?!english)/,
				// contextRegExp: /bip39\\src$/ // Linux
				contextRegExp: /bip39\/src$/ // Windows
			})
		]
	},

	pwa: {
		name: process.env.VUE_APP_TITLE,
		themeColor: process.env.VUE_APP_BACKGROUND,
		msTileColor: process.env.VUE_APP_BACKGROUND,
		manifestPath: 'manifest.json',
		manifestOptions: {
			name: process.env.VUE_APP_TITLE,
			short_name: process.env.VUE_APP_TITLE,
			description: process.env.VUE_APP_DESCRIPTION,
			background_color: process.env.VUE_APP_BACKGROUND,
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
		},
		iconPaths: {
			appleTouchIcon: 'arweave-192.png',
			favicon32: null,
			favicon16: null,
			maskIcon: null,
			msTileImage: null,
		},
		workboxPluginMode: 'InjectManifest',
		workboxOptions: {
			swSrc: 'src/service-worker.js',
		}
	},

	pluginOptions: {
		electronBuilder: {
			nodeIntegration: false,
			preload: 'src/preload.js', // preload file 
			builderOptions: {
				appId: 'wallet.arweave', // app ID
				productName: process.env.VUE_APP_TITLE, // app nmae
				copyright: ``,
				win: { // Windows
					icon: 'public/arweave-512.png', // app icon
					target: ['nsis', 'portable', 'zip'] // install methods
				},
				linux: { // Linux
					icon: 'build/icons'
				},
				mac: { // Mac
					icon: 'build/icons/icon.icns'
				},
				nsis: {
					oneClick: false,
					perMachine: true, 
					installerIcon: 'build/icons/icon.ico',
					uninstallerIcon: 'build/icons/icon.ico',
					installerHeaderIcon: 'build/icons/icon.ico',
					allowToChangeInstallationDirectory: true,
					createDesktopShortcut: true,
					createStartMenuShortcut: true
				},
				publish: [{
					provider: 'github',
					owner: '',
					repo: 'https://github.com/jfbeats/ArweaveWebWallet'
				}]
			}
		},
	}
}
