import mitt from 'mitt'



type BaseEvents = { destructor: undefined }
type AllEvents<T> = Flatten<BaseEvents & T>

export class Emitter<T extends Record<string, unknown> = {}> {
	#mittInstance = mitt<AllEvents<T>>()
	emit = <Method extends keyof AllEvents<T>> (method: Method, params: AllEvents<T>[Method]) => {this.#mittInstance.emit(method, params)}
	on = <Method extends keyof AllEvents<T>> (method: Method, handler: (params: AllEvents<T>[Method]) => void) => {this.#mittInstance.on(method, handler)}
	off = <Method extends keyof AllEvents<T>> (method: Method, handler: (params: AllEvents<T>[Method]) => void) => {this.#mittInstance.off(method, handler)}
	once = <Method extends keyof AllEvents<T>> (method: Method, handler: (params: AllEvents<T>[Method]) => void) => {
		return new Promise(resolve => {
			const wrapper: typeof handler = (e) => {
				this.off(method, wrapper);
				resolve(e);
				if (handler) { handler(e) }
			}
			this.on(method, wrapper)
		})
	}
	destructor () { this.emit('destructor', undefined) }
}



type ProvideResult<T> = T extends (...a: any) => any ? ReturnType<T> : never
type ArrayToFunResult<C> = { [Property in keyof C]: ProvideResult<C[Property]> }

class MixinBuilder<Base> {
	constructor (public superclass: Base) { }
	with<T extends readonly any[]> (...mixins: T) { return mixins.reduce((c, mixin) => mixin(c), this.superclass) as UnionToIntersection<ArrayToFunResult<T>[number]> & Base }
}

export function mix<Base extends ClassConstructor> (superclass: Base) { return new MixinBuilder(superclass) }