export function findRoutePosition (name: string, arr: any[]) {
	const result = findRecursive(name, arr)
	return result.found ? result : null
}

function findRecursive (name: string, arr: any[], position = 0, depth = 0): { found: boolean, position: number, depth: number } {
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