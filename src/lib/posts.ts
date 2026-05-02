export type PostMetadata = {
	title: string;
	date: string;
	description?: string;
};

export type PostSummary = PostMetadata & {
	slug: string;
};

const modules = import.meta.glob<{ metadata: PostMetadata }>('/src/posts/*.md', { eager: true });

export const posts: PostSummary[] = Object.entries(modules)
	.map(([path, mod]) => {
		const slug = path.split('/').pop()!.replace(/\.md$/, '');
		return { slug, ...mod.metadata };
	})
	.sort((a, b) => +new Date(b.date) - +new Date(a.date));
