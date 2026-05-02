import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const prerender = true;

const USERNAME = 'andusystems-dev-0';

export const GET: RequestHandler = async () => {
	const res = await fetch(`https://github.com/users/${USERNAME}/contributions`);
	if (!res.ok) return json({}, { status: 502 });

	const html = await res.text();
	const levels: Record<string, number> = {};

	for (const [, date, level] of html.matchAll(
		/data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g
	)) {
		levels[date] = parseInt(level, 10);
	}

	return json(levels);
};
