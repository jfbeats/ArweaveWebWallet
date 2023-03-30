import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { debounce, fileNameToKey } from './src/functions/Utils.js'
import type { PluginOption } from 'vite'



const svgTypes = debounce(() => {
	const __filename = fileURLToPath(import.meta.url)
	const __dirname = path.dirname(__filename)
	const iconsDir = path.join(__dirname, 'src', 'assets', 'icons')
	const logoDir = path.join(__dirname, 'src', 'assets', 'logos')
	let output = ''
	output += generateTsFileFromDirectory('SVGIcon', iconsDir)
	output += generateTsFileFromDirectory('SVGLogo', logoDir)
	fs.writeFileSync(path.join(__dirname, 'src', 'types', 'generated.d.ts'), output)
	console.log('types generated')
}, { timeout: 1000 })

function generateTsFileFromDirectory(typeName: string, dir: string, depth: number = 1) {
	const indent = '	'.repeat(depth)
	let output = ''
	const files = fs.readdirSync(dir)
	for (const file of files) {
		const filePath = path.join(dir, file)
		const stat = fs.statSync(filePath)
		if (stat.isDirectory()) {
			output += `${indent}'${file}': {\n${generateTsFileFromDirectory(typeName, filePath, depth + 1) + indent}}\n`
		} else {
			output += `${indent}'${fileNameToKey(file)}': Icon\n`
		}
	}
	if (depth === 1) { return `type ${typeName} = {\n${output}}\n` } else { return output }
}

export const buildTypes: PluginOption = { name: 'buildTypes',
	configureServer: server => { svgTypes() },
	handleHotUpdate: update => { update.file.endsWith('.svg') && svgTypes() },
}