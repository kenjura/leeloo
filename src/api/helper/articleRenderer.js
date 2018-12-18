const markdown = require('markdown').markdown;
const { dirname, extname } = require('path');
const { wikiToHtml } = require('./WikiUtil');

module.exports = { render };

function render({ filePath, text, ...args }) {
	const ext = extname(filePath);
	const renderer = getRenderer(ext);
	return renderer({ filePath, text, ...args });
}

function getRenderer(ext) {
	switch(ext) {
		case '.html': return renderHTML;
		case '.css': return renderCSS;
		case '.md': return renderMarkdown;
		case '.txt': return renderWikitext;
		default: throw new Error (`articleRenderer > getRenderer > unknown extension ${ext}`);
	}
}

function renderCSS({ text }) {
	return { wikitext:text };
}
function renderHTML({ text }) {
	return { wikitext:text };
}
function renderMarkdown({ text }) {
	return {
		html: markdown.toHTML(text),
		wikitext: text,
	}
}
function renderWikitext({ filePath, text, ...args }) {
	const articleName = filePath
		.replace(dirname(filePath)+'/', '')
		.replace(extname(filePath), '');
	return wikiToHtml(text, articleName, args);
}



// function wikiToHtml(wikitext,articleName,args) {
// 	if (!args) args = { db:'noDB', noSection:true, noTOC:true };
// 	if (!wikitext) return 'nothing to render';