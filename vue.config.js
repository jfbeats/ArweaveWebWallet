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
		manifestPath: 'manifest.json',
		manifestOptions: {
			icons: [
				{
					src: 'arweaveLogo.svg',
					purpose: "maskable any",
					type: "image/svg+xml",
					sizes: "any",
				}
			]
		},
		iconPaths: {
			favicon32: null,
			favicon16: null,
			appleTouchIcon: null,
			maskIcon: null,
			msTileImage: null,
		},
		workboxPluginMode: 'InjectManifest',
		workboxOptions: {
			swSrc: 'src/service-worker.js',
		}
	}
}
