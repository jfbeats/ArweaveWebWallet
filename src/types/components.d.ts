type Icon = import('vue').FunctionalComponent<import('vue').SVGAttributes, {}> | string

type DisplayMetadata = {
	name?: string
	icon?: Icon
	color?: string
	disabled?: any
}

type Action = DisplayMetadata & { // Todo type action in defineProps
	run?: Function
	to?: import('vue-router').RouteLocationRaw
}

type RefMaybe <T> = import('vue').Ref<T> | T