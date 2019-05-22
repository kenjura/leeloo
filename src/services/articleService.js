import getDbFromPath from '../helpers/getDbFromPath';

import { markdown } from 'markdown';
import { wikiToHtml } from '../api/helper/WikiUtil';

export { read, render, renderTOC, update };


async function read(path) {
	const url = `/api/article/${path}`;
	const result = await fetch(url);
	if (result.status >= 400) return { status:result.status };
	const json = await result.json();
	return json;
}

function render(article) {
	const { content, extension } = article;
	if (!content || !content.length) return '';
	switch (extension) {
		case 'txt': return renderWiki(content);
		case 'md': return renderMarkdown(content);
		case 'html': return content;
		default: throw new Error(`articleService > render > unknown format "${extension}"`);
	}

	function renderMarkdown(content) {
		const html = markdown.toHTML(content);
		return html;
	}
	function renderWiki(content) {
		const wiki = wikiToHtml(content, 'articleName tbd', { noSection:true });
		return wiki.html;
	}
}
function renderTOC(article) {
	const { content, extension } = article;
	if (!content || !content.length) return '';
	switch (extension) {
		case 'txt': return renderWiki(content);
		case 'md': return renderMarkdown(content);
		case 'html': return content;
		default: throw new Error(`articleService > render > unknown format "${extension}"`);
	}

	function renderMarkdown(content) {
		return 'toc tbd';
	}
	function renderWiki(content) {
		const wiki = wikiToHtml(content, 'articleName tbd', { noTOC:false });
		return wiki.tocHtml;
	}
}

async function update(path, body) {
	console.log('updating...', { path, body });
	return { status:200 };
}