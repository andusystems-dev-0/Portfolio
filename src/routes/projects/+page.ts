import { projects } from '$lib/projects';

export const prerender = true;

export function load() {
	return { projects };
}
