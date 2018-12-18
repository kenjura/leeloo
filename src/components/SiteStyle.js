import State from '../State.js';

export default class SiteStyle extends HTMLStyleElement {
	constructor() {
		super();

		this.populate();
	}

	async populate() {
		const db = State.getDB();
		const url = `/api/article/${db}/_style.leeloo?noTOC=true&noH1=true&noSection=true&db=${db}`;
		const result = await fetch(url);
		const json = await result.json();

		this.innerText = json.wikitext;;
	}
}

customElements.define('site-style', SiteStyle, { extends:'style' });
