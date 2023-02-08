import { ref, watch } from 'vue'
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