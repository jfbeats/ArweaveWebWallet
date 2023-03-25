import { ref, watch } from 'vue'
import { fileStructureFromGlobImport } from '@/functions/Utils'

const getDefault = () => ({
	
	red: '#BF616A',
	orange: '#D08770',
	yellow: '#EBCB8B',
	green: '#A3BE8C',
	purple: '#B48EAD',
	grey: '#81A1C1',
	blue: '#5E81AC',
	
	background: import.meta.env.VITE_BACKGROUND,
	background2: '#181818',
	background3: '#262626',
	color: '#eeeeee',
	'element-secondary': '#bbbbbb',
	border: '#222222',
	border2: '#333333',
	border3: '#555555',
	
}) as const
export const colors = ref(getDefault())
watch(colors, colors => Object.entries(colors).forEach(
	([color, value]) => document.documentElement.style.setProperty('--' + color, value)
), { immediate: true })

export const ICON: SVGIcon = fileStructureFromGlobImport('/src/assets/icons/', import.meta.glob('/src/assets/icons/**', { import: 'default', eager: true }))
export const LOGO: SVGLogo = fileStructureFromGlobImport('/src/assets/logos/', import.meta.glob('/src/assets/logos/**', { import: 'default', eager: true }))

function hexToRgb (hex: string) {
	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
	return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)].join(',') : null
}

function rgbToHex (rgb: string) {
	const [r, g, b] = rgb.split(',').map(v => +v)
	return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

export function normalizeColorTo (type: 'hex' | 'rgb', color?: string) {
	if (color?.startsWith('var')) { color = colors.value[color.replace('var(--', '').replace(')', '') as keyof typeof colors['value']] }
	if (!color) { return colors.value['red'] }
	if (type === 'rgb' && color.startsWith('#')) { return hexToRgb(color) }
	if (type === 'hex' && color.includes(',')) { return rgbToHex(color) }
	return color
}

export function addressHashToColor (addressHash?: string) {
	if (!addressHash) { return [0, 0, 0] }
	const colors = hsl2rgb(parseInt(addressHash.substr(-7), 16) / 0xfffffff, 0.25, 0.6)
	return colors.map(Math.round)
}

function hsl2rgb (h: number, s: number, b: number) {
	h *= 6
	const s2 = [b += s *= b < .5 ? b : 1 - b, b - h % 1 * s * 2, b -= s *= 2, b, b + h % 1 * s, b + s]
	return [s2[~~h % 6] * 255, s2[(h | 16) % 6] * 255, s2[(h | 8) % 6] * 255]
}