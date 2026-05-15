// Postbuild step: pull SvelteKit's inline hydration <script> out of every
// prerendered HTML file and turn it into an external <script src="..."> served
// from /_app/immutable/start/. With no inline scripts left on the page, the
// CSP can be a plain `script-src 'self'` — no per-build sha256 hashes needed,
// which is the bug this script exists to fix (page-level CSP hash drift caused
// browsers to block hydration with the wrong hash).
//
// Relies on svelte.config.js setting `kit.paths.relative = false` so the
// bootstrap is byte-identical across pages and dedupes to one file.

import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { gzip, brotliCompress, constants } from 'node:zlib';
import { promisify } from 'node:util';

const gzipP = promisify(gzip);
const brotliP = promisify(brotliCompress);

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BUILD_DIR = join(ROOT, 'build');
const SCRIPT_DIR_REL = '_app/immutable/start';
const SCRIPT_DIR = join(BUILD_DIR, SCRIPT_DIR_REL);

async function* walk(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	for (const e of entries) {
		const p = join(dir, e.name);
		if (e.isDirectory()) yield* walk(p);
		else yield p;
	}
}

async function compressSiblings(path, buf) {
	await writeFile(`${path}.gz`, await gzipP(buf, { level: 9 }));
	await writeFile(`${path}.br`, await brotliP(buf, {
		params: { [constants.BROTLI_PARAM_QUALITY]: 11 }
	}));
}

async function main() {
	await mkdir(SCRIPT_DIR, { recursive: true });

	const htmlFiles = [];
	for await (const file of walk(BUILD_DIR)) {
		if (file.endsWith('.html')) htmlFiles.push(file);
	}

	let externalized = 0;
	const writtenScripts = new Set();

	for (const file of htmlFiles) {
		let html = await readFile(file, 'utf8');

		// Match the parameterless <script> SvelteKit emits for hydration. Any
		// <script src="..."> or <script type="..."> tags are left untouched.
		const match = html.match(/<script>([\s\S]*?)<\/script>/);
		if (!match) continue;

		const body = match[1];
		const hash = createHash('sha256').update(body).digest('hex').slice(0, 16);
		const scriptName = `bootstrap.${hash}.js`;
		const scriptPath = join(SCRIPT_DIR, scriptName);

		if (!writtenScripts.has(scriptPath)) {
			await writeFile(scriptPath, body);
			await compressSiblings(scriptPath, Buffer.from(body));
			writtenScripts.add(scriptPath);
		}

		const externalTag = `<script src="/${SCRIPT_DIR_REL}/${scriptName}"></script>`;
		html = html.replace(match[0], externalTag);

		// Strip sha256-* hashes from the meta CSP's script-src — they were
		// generated for the now-externalized inline script and are dead weight.
		// Scope the strip to script-src so other directives are untouched.
		html = html.replace(
			/script-src(?!-)[^;"]*/g,
			(seg) => seg.replace(/\s*'sha256-[A-Za-z0-9+/=]+'/g, '')
		);

		await writeFile(file, html);
		await compressSiblings(file, Buffer.from(html));

		externalized++;
	}

	console.log(
		`postbuild: externalized hydration script from ${externalized} HTML file(s), ` +
		`wrote ${writtenScripts.size} bootstrap chunk(s).`
	);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
