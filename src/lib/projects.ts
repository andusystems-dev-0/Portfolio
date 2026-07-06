export type Project = {
	name: string;
	/** Live URL the project name links to. */
	url: string;
	description: string;
	/**
	 * Optional screenshot. Must be a local asset under /static (the site CSP is
	 * `img-src 'self' data:`, so remote images are blocked) — e.g. drop a file at
	 * `static/projects/hireship.png` and set this to `/projects/hireship.png`.
	 * Leave undefined to render the graceful placeholder until a real asset exists.
	 */
	screenshot?: string;
};

// Add new projects here — the /projects page renders this array in a loop.
export const projects: Project[] = [
	{
		name: 'Hireship',
		url: 'https://hireship.io',
		description:
			'A job aggregator and scoring engine that pulls in postings and ranks each one against your profile with a multi-pass, AI-driven scoring pipeline. Fully self-hosted on a private Kubernetes cluster.'
		// TODO: add a screenshot at static/projects/hireship.png, then set:
		// screenshot: '/projects/hireship.png'
	}
];
