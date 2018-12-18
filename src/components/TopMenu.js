import Router from '../Router.js';
import State from '../State.js';

export default class TopMenu extends HTMLElement {
	constructor() {
		super();

		this.state = {
			menu: '',
		};

		this.innerHTML = this.render();
		this.populate();
	}

	async populate() {
		const db = State.getDB();
		const url = `/api/article/${db}/_menu?noTOC=true&noH1=true&noSection=true&db=${db}`;
		const result = await fetch(url);
		const json = await result.json();
		this.state.menu = json.html;

		const fullPath = window.location.pathname.replace('/edit','');

		this.render({ fullPath, db });
	}

	render({ fullPath, db }={}) {
		this.innerHTML = `<nav id="topnav">
			<span id="topnav-admin" class="dropdown">
				Menu
				<span class="dropdown-content">
					<a href="/${db}/">Home</a>
					<a href="/">Site Root</a>
					<a href="${fullPath}/edit">Edit this article</a>
					<a href="/${db}/_menu/edit">Edit site menu</a>
					<a href="/${db}/_style.leelo/edit">Edit site style</a>
				</span>
			</span>
			<span id="topnav-main" class="dropdown-menu">
				${this.state.menu}
			</span>
			<span class="dropdown-menu" style="float:right"></span>
		</nav>`;
	}
}

customElements.define('top-menu', TopMenu);
