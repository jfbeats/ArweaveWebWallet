import { compactTrue } from '../src/functions/Utils.ts'
import type { IdLocation } from '@/router/routing'
// Used by build.ts, no imports

export type MetaTag = { tag: 'meta' | 'title' | 'link', attributes?: { [key in 'name' | 'property' | 'content' | 'rel' | 'href']?: string }, content?: string }
export type ContentType = 'default' | 'website' | 'video' | 'image' | 'music' | 'article' | 'book' | 'profile'



const TagsComponents = {
	image: (url: string) => [
		{ tag: 'meta', attributes: { property: 'og:image', name: 'twitter:image', content: url } },
	],
} satisfies { [key: string]: ((val: string, type: ContentType) => MetaTag[]) }

const Tags = {
	url: (content: string) => [
		{ tag: 'meta', attributes: { property: 'og:url', name: 'twitter:url', content } },
	],
	title: (content: string) => [
		{ tag: 'title', content },
		{ tag: 'meta', attributes: { name: 'title', content }},
		{ tag: 'meta', attributes: { property: 'og:title', name: 'twitter:title', content } },
	],
	description: (content: string) => [
		{ tag: 'meta', attributes: { name: 'description', content } },
		{ tag: 'meta', attributes: { property: 'og:description', name: 'twitter:description', content } },
	],
	type: (url: string, type: ContentType = 'default', options?: { mime?: string, width?: string, height?: string }) => [
		...(type === 'default' ? [
			...TagsComponents.image(url),
			{ tag: 'meta', attributes: { name: 'twitter:card', content: 'summary_large_image' } },
			{ tag: 'meta', attributes: { property: 'og:type', content: type } },
		] satisfies MetaTag[] : []),
		...(['image'].includes(type) ? [
			...TagsComponents.image(url),
			{ tag: 'meta', attributes: { name: 'twitter:card', content: 'summary_large_image' } },
		] satisfies MetaTag[] : []),
		...(['music'].includes(type) ? [
			{ tag: 'meta', attributes: { property: 'og:type', content: 'music.song' } },
		] satisfies MetaTag[] : []),
		...(['video'].includes(type) ? compactTrue([
			{ tag: 'meta', attributes: { name: 'twitter:card', content: 'player' } },
			{ tag: 'meta', attributes: { name: 'twitter:player:stream', content: url } },
			options?.width && { tag: 'meta', attributes: { name: 'twitter:player:width', content: options.width } },
			options?.height && { tag: 'meta', attributes: { name: 'twitter:player:height', content: options.height } },
			{ tag: 'meta', attributes: { property: 'og:type', content: 'video.other' } },
		]) satisfies MetaTag[] : []),
		...(['video', 'image'].includes(type) ? compactTrue([
			{ tag: 'meta', attributes: { property: `og:${type}:url`, content: url } },
			{ tag: 'meta', attributes: { property: `og:${type}:secure_url`, content: url } },
			options?.mime && { tag: 'meta', attributes: { property: `og:${type}:type`, content: options.mime } },
			options?.width && { tag: 'meta', attributes: { property: `og:${type}:width`, content: options.width } },
			options?.height && { tag: 'meta', attributes: { property: `og:${type}:height`, content: options.height } },
		]) satisfies MetaTag[] : []),
		...(['article', 'book'].includes(type) ? [
			{ tag: 'meta', attributes: { property: 'og:type', content: type } },
		] satisfies MetaTag[] : []),
		...(['profile'].includes(type) ? [
			{ tag: 'meta', attributes: { property: 'og:type', content: type } },
		] satisfies MetaTag[] : []),
		...(['website'].includes(type) ? [
			{ tag: 'meta', attributes: { property: 'og:type', content: type } },
		] satisfies MetaTag[] : []),
	],
	tags: (content: string, type: ContentType = 'default') => [
		{ tag: 'meta', attributes: { name: 'keywords', content } },
		...content.split(', ').map(tag => ({ tag: 'meta', attributes: { name: type === 'default' ? `og:tag` : `og:${type}:tag`, content: tag } } as const)),
	],
} satisfies { [key: string]: ((val: string, type: ContentType) => MetaTag[]) }



export function buildMeta (env?: { [key: string]: string }, idLocation?: IdLocation, encode = (s?: string) => s) {
	encode = encodeHTML(encode)
	const title = idLocation?.resolved?.meta?.title || env?.VITE_TITLE || import.meta.env.VITE_TITLE
	const description = idLocation?.resolved?.meta?.description || env?.VITE_DESCRIPTION || import.meta.env.VITE_DESCRIPTION
	const domain = env?.VITE_DOMAIN || import.meta.env.VITE_DOMAIN
	const gateway = env?.VITE_GATEWAY || import.meta.env.VITE_GATEWAY
	const cover = domain + (env?.VITE_COVER || import.meta.env.VITE_COVER)
	const favicon = domain + (env?.VITE_FAVICON || import.meta.env.VITE_FAVICON)
	const tags = [
		{ tag: 'link', attributes: { rel: 'favicon icon', href: favicon } },
		{ tag: 'meta', attributes: { property: 'og:site_name', content: 'arweave.app' } },
		{ tag: 'meta', attributes: { name: 'twitter:site', content: '@ArweaveApp' } },
	] as MetaTag[]
	const contentType = txToOg(idLocation)
	if (idLocation && contentType) {
		if (contentType.type === 'profile') {
			tags.push(...Tags.url(domain + 'profile/' + idLocation.id)) // todo change absolute url, maybe in idLocation.resolved
			tags.push(...Tags.type('', contentType.type))
		} else {
			tags.push(...Tags.url(domain + 'tx/' + idLocation.id))
			tags.push(...Tags.type(gateway + idLocation.id, contentType.type, { mime: contentType.mime }))
		}
	} else {
		tags.push(...Tags.title(title))
		tags.push(...Tags.description(description))
		tags.push(...Tags.type(cover, 'default')) // todo fix property="og:type" content="default"
	}
	return tags.map(createHTMLTag).join('')
}



function createHTMLTag (tagInfo: MetaTag): string {
	const { tag, attributes, content } = tagInfo
	const attributeStr = Object.entries(attributes || []).map(([key, value]) => ` ${key}="${value}"`).join('')
	const contentStr = content || ''
	return contentStr ? `<${tag}${attributeStr}>${contentStr}</${tag}>` : `<${tag}${attributeStr}>`
}

function txToOg (idLocation?: IdLocation, encode = (s?: string) => s) {
	if (!idLocation) { return }
	encode = encodeHTML(encode)
	const location = idLocation.location.name || idLocation.location
	if (location === 'Tx' && 'owner' in idLocation.data.node) {
		const mime = encode(idLocation.data.node.tags.find(t => t.name === 'Content-Type')?.value)
		const conversion = {
			article: undefined,
			book: undefined,
			video: mime?.startsWith('video'),
			image: mime?.startsWith('image'),
			music: mime?.startsWith('audio'),
			website: undefined,
		} satisfies { [key in ContentType]?: any }
		const type = encode(Object.entries(conversion).find(([_, v]) => v)?.[0]) as undefined | ContentType
		if (type) { return { type, mime } }
	}
	if (location === 'Profile') { return { type: 'profile' as ContentType } }
}

function encodeHTML <T extends string | undefined> (f: Function): (s: T) => T {
	return (s: T) => s == undefined ? undefined : f(s)
}