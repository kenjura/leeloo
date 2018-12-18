import State from '../State.js';

export default class ArticleView extends HTMLElement {
	constructor() {
		super();

		const style = document.createElement('link');
		style.setAttribute('rel', 'stylesheet');
		style.setAttribute('href', '/components/ArticleView.css');
		document.head.appendChild(style);

		this.start();
	}

	async getArticle(articlePath) {
		const db = State.getDB();
		const url = `/api/article/${articlePath}?db=${db}&noSection=true`;
		const result = await fetch(url);
		const json = await result.json();
		return json;
	}

	async renderArticle(articlePath) {
		const { html, wikitext } = await this.getArticle(articlePath);
		this.render({ html });

		// tocbot-specific code
		this.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(e => e.hasAttribute('id') ? null : e.setAttribute('id', e.innerText.replace(/ /g,'-')));

		tocbot.init({
		  // Where to render the table of contents.
		  tocSelector: 'nav#toc',
		  // Where to grab the headings to build the table of contents.
		  contentSelector: 'article-view',
		  // Which headings to grab inside of the contentSelector element.
		  headingSelector: 'h1, h2, h3',
		});

		// sectioning code - it worked last time I ran it
		const elements = this.children;
		let sections = [];
		let currentSection = [];
		for (let i = 0; i < elements.length; i++) {
			let element = elements[i];
			if (element.tagName === 'H1' && currentSection.length > 0) {
				sections.push(currentSection.map(a=>a));
				currentSection = [element];
			} else {
				currentSection.push(element);
			}
			if (i === elements.length - 1) sections.push(currentSection.map(a=>a));
		};
		this.innerHTML = '';
		sections.forEach(section => {
			let element = document.createElement('section');
			element.className = 'sectionOuter';
			section.forEach(e => element.appendChild(e));
			this.appendChild(element);
		})
	}

	render({ html }) {
		this.innerHTML = `<div id="article-view">
			${html}
		</div>`;
	}

	start() {
		const articlePath = window.location.pathname;
		this.renderArticle(articlePath);
	}
}

customElements.define('article-view', ArticleView);
