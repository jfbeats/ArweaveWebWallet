module.exports = {
	publicPath: process.env.GITHUB_ACTIONS ? '/' : '',

	pwa: {
		name: 'Arweave Wallet',
		themeColor: '#151515',
		manifestPath: 'manifest.json',
		manifestOptions: {
			icons: [
				{
					src: require('@/assets/logos/arweave.svg'),
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
