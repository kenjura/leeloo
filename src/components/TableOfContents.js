export default class TableOfContents extends HTMLElement {
	constructor() {
		super();

		this.className += ' dropdown-menu';
	}

	connectedCallback() {
		this.render();
	}

	nodesToTree(nodes) {
		const tree = [];
		for (let i = 0; i < nodes.length; i++) {
			let currentNode = tree[tree.length-1];
			if (!currentNode) {
				tree.push()
			}
		}
	}

	render() {
		// make sure all headers have an id
		this.parentNode.querySelectorAll('h1, h2, h3').forEach(e => e.hasAttribute('id') ? null : e.setAttribute('id', e.innerText.replace(/ /g,'-')));

		const topLevelNodes = this.parentNode.querySelectorAll('h1');

		const tliHtml = Array.from(topLevelNodes)
			.map(node => `<li><a href="#${node.id}">${node.innerText}</a></li>`)
			.join('');

		const html = `<ul>${tliHtml}</ul>`;
		this.innerHTML = html;
	}
}

function parseNode(node, depth) {
	if (depth > 3) return;

	// const childNodes = node.

	const html = `<li><a href="#${node.id}">${node.innerText}</a></li>`;
}

customElements.define('table-of-contents', TableOfContents);