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
	type: (url: string, type: ContentType = 'default', options?: { mime: string, width: string, height: string }) => [
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
		...(['video'].includes(type) ? [
			{ tag: 'meta', attributes: { name: 'twitter:card', content: 'player' } },
			{ tag: 'meta', attributes: { name: 'twitter:player:stream', content: url } },
			{ tag: 'meta', attributes: { name: 'twitter:player:width', content: options?.width } },
			{ tag: 'meta', attributes: { name: 'twitter:player:height', content: options?.height } },
			{ tag: 'meta', attributes: { property: 'og:type', content: 'video.other' } },
		] satisfies MetaTag[] : []),
		...(['video', 'image'].includes(type) ? [
			{ tag: 'meta', attributes: { property: `og:${type}:url`, content: url } },
			{ tag: 'meta', attributes: { property: `og:${type}:secure_url`, content: url } },
			{ tag: 'meta', attributes: { property: `og:${type}:type`, content: options?.mime } },
			{ tag: 'meta', attributes: { property: `og:${type}:width`, content: options?.width } },
			{ tag: 'meta', attributes: { property: `og:${type}:height`, content: options?.height } },
		] satisfies MetaTag[] : []),
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



export function buildMeta (env?: { [key: string]: string }, urlString?: string) {
	const domain = env?.VITE_DOMAIN || import.meta.env.VITE_DOMAIN
	const cover = domain + (env?.VITE_COVER || import.meta.env.VITE_COVER)
	const favicon = domain + (env?.VITE_FAVICON || import.meta.env.VITE_FAVICON)
	const tags = [
		// ...Tags.url(domain),
		...Tags.title(env?.VITE_TITLE || import.meta.env.VITE_TITLE),
		...Tags.description(env?.VITE_DESCRIPTION || import.meta.env.VITE_DESCRIPTION),
		...Tags.type(cover, 'default'),
		{ tag: 'link', attributes: { rel: 'favicon icon', href: favicon } },
		{ tag: 'meta', attributes: { property: 'og:site_name', content: 'arweave.app' } },
		{ tag: 'meta', attributes: { name: 'twitter:site', content: '@ArweaveApp' } },
	] satisfies MetaTag[]
	return tags.map(createHTMLTag).join('')
}



function extractId (urlString: string) {
	if (!urlString) { return }
	const url = new URL(urlString)
	const id = url.pathname.split('/').reverse().find(param => param && param?.match(/^[a-z0-9_-]{43}$/i))
	if (!id) { return }
	const link = `https://arweave.net/${id}`
}

function createHTMLTag(tagInfo: MetaTag): string {
	const { tag, attributes, content } = tagInfo
	const attributeStr = Object.entries(attributes || []).map(([key, value]) => ` ${key}="${value}"`).join("")
	const contentStr = content || ""
	return contentStr ? `<${tag}${attributeStr}>${contentStr}</${tag}>` : `<${tag}${attributeStr}>`
}