import { posts } from '$lib/posts';

export const prerender = true;

export function load() {
	return { posts };
}
