import State from '../State.js';

export default class ArticleEdit extends HTMLElement {
	constructor() {
		super();

		const style = document.createElement('link');
		style.setAttribute('rel', 'stylesheet');
		style.setAttribute('href', '/components/ArticleEdit.css');
		document.head.appendChild(style);

		this.state = {
			article: {
				wikitext: ''
			}
		}

		this.render();
		this.populate();


		window.articleEdit = this;
	}

	connectedCallback() {
		const saveButton = this.querySelector('button[action="save"]');
		saveButton.addEventListener('click', event => {
			console.log(event);
			this.write();
		});
		this.addEventListener('click', event => {
			console.log('blargo',event);

		})
	}

	async getArticle(articlePath) {
		const db = State.getDB();
		const url = `/api/article/${articlePath}?db=${db}&noSection=true`;
		const result = await fetch(url);
		const json = await result.json();
		return json;
	}

	async putArticle(articlePath, text) {
		const db = State.getDB();
		const method = 'PUT';
		const url = `/api/article${articlePath}`;
		const headers = { "Content-Type": "application/json; charset=utf-8" };
		const body = JSON.stringify({ body:text });
		const result = await fetch(url, { method, body, headers });
		const json = await result.json();
		return json;
	}


	async populate() {
		const articlePath = window.location.pathname.replace('/edit','');
		const article = await this.getArticle(articlePath);
		this.querySelector('textarea').value = article.wikitext;
	}

	async write() {
		const articlePath = window.location.pathname.replace('/edit','');
		const body = this.querySelector('textarea').value;
		this.putArticle(articlePath, body);
	}

	render() {
		this.innerHTML = `
			<div class="edit-controls">
				<button secondary>Cancel</button>
				<button action="save" primary>Save</button>
			</div>
			<textarea>${this.state.article.wikitext}</textarea>
		`;
	}
}

customElements.define('article-edit', ArticleEdit);
