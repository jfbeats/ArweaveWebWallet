type AnyFunction<A = any> = (...args: any[]) => A
type ClassConstructor<T = {}> = new (...args: any[]) => T
type MixinType<T extends AnyFunction> = InstanceType<ReturnType<T>>
type Null = null | undefined

type Override<T, U> = Omit<T, keyof U> & U

type Flatten<T> = T extends Record<string, any> ? { [k in keyof T]: T[k] } : never
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

type ExtraProperties <T> = { [key in keyof UnionToIntersection<T>]: key extends keyof T ? T[key] : Partial<UnionToIntersection<T>>[key] }
type Union<T> = T & ExtraProperties<T>