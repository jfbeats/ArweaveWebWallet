import type { RouteRecordName } from 'vue-router'

export function getBaseUrl () {
	return window.BASE_URL ?? import.meta.env.BASE_URL
}

export function findRoutePosition (name:  RouteRecordName | Null, arr: any[]) {
	const result = findRecursive(name, arr)
	return result.found ? result : null
}

function findRecursive (name:  RouteRecordName | Null, arr: any[], position = 0, depth = 0): { found: boolean, position: number, depth: number } {
	for (const route of arr) {
		if (route.name === name) { return { found: true, position, depth } }
		position++
		if (route.children) {
			const recResult = findRecursive(name, route.children, position, depth + 1)
			position += recResult.position
			if (recResult.found) { return { found: true, position, depth: recResult.depth } }
		}
	}
	return { found: false, position, depth }
}