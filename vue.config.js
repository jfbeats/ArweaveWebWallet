const webpack = require('webpack')

module.exports = {
	publicPath: process.env.GITHUB_ACTIONS ? '/' : '',

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
		name: 'Arweave Wallet',
		themeColor: '#151515',
		msTileColor: '#151515',
		manifestPath: 'manifest.json',
		manifestOptions: {
			name: 'Arweave Web Wallet',
			short_name: 'Arweave Wallet',
			description: 'Manage tokens from the browser, upload permanent data, interact with the weave',
			background_color: '#151515',
			display: 'standalone',
			start_url: '.',
			icons: [
				{
					src: 'arweaveLogo.svg',
					purpose: 'maskable any',
					type: 'image/svg+xml',
					sizes: 'any',
				}
			]
		},
		iconPaths: {
			favicon32: null,
			favicon16: null,
			appleTouchIcon: null,
			maskIcon: 'arweaveLogo.svg',
			msTileImage: 'arweaveLogo.svg',
		},
		workboxPluginMode: 'InjectManifest',
		workboxOptions: {
			swSrc: 'src/service-worker.js',
		}
	}
}
