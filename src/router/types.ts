import type { RouteLocationOptions, RouteLocationPathRaw, RouteLocationRaw, RouteParamsRaw, RouteQueryAndHash, Router } from 'vue-router'
import type { findRoutePosition } from '@/router/Utils'
import { RouteRecordRaw } from 'vue-router'



export type ExtractNames<T> = T extends AsConst<RouteRecordRaw[]>
	? ExtractNames<T[keyof T]>
	: T extends { name?: infer N, children?: infer C }
		? C extends AsConst<RouteRecordRaw[]>
			? (N extends string ? N | ExtractNames<C> : ExtractNames<C>)
			: N extends string ? N : never
		: never



declare module 'vue-router' {
	interface RouteMeta {
		title?: string
		transition?: {
			param?: {
				from: ReturnType<typeof findRoutePosition>
				to: ReturnType<typeof findRoutePosition>
			}
			nameWallet?: number
			nameLayout?: number
		}
	}
	
	interface LocationAsRelativeRawAlt {
		name?: AllRouteNames
		params?: RouteParamsRaw
	}
	
	interface RouteLocationNamedRawAlt extends RouteQueryAndHash, LocationAsRelativeRawAlt, RouteLocationOptions {}
	
	export type RouteLocationRawAlt = AllRouteNames | RouteLocationPathRaw | RouteLocationNamedRawAlt
	
	export type RouterAlt = Override<Router, {
		push: ReplaceType<Router['push'], RouteLocationRaw, RouteLocationRawAlt>
		replace: ReplaceType<Router['replace'], RouteLocationRaw, RouteLocationRawAlt>
	}>
}