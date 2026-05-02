import { error } from '@sveltejs/kit';
import type { PostMetadata } from '$lib/posts';
import { posts } from '$lib/posts';

export const prerender = true;

export function entries() {
	return posts.map((p) => ({ slug: p.slug }));
}

const modules = import.meta.glob<{
	default: ConstructorOfATypedSvelteComponent;
	metadata: PostMetadata;
}>('/src/posts/*.md');

export async function load({ params }) {
	const path = `/src/posts/${params.slug}.md`;
	const loader = modules[path];
	if (!loader) throw error(404, 'Post not found');
	const mod = await loader();
	return {
		slug: params.slug,
		content: mod.default,
		metadata: mod.metadata
	};
}
