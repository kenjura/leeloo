import React from 'react';
import Router from '../Router.js';
import State from '../State.js';

export default class TopMenu extends React.Component {
	constructor() {
		super();

		this.state = {
			db: State.getDB(),
			fullPath: window.location.pathname.replace('/edit',''),
			menu: '',
			user: {},
		};

		this.innerHTML = this.render();
		this.populate();
	}

	async populate() {
		this.populateMenu();
		this.populateUser();
	}

	async populateMenu() {
		const db = State.getDB();
		const url = `/api/article/${db}/_menu?noTOC=true&noH1=true&noSection=true&db=${db}`;
		const result = await fetch(url);
		const json = await result.json();

		this.setState({ menu: json.html });

		this.render();
	}

	async populateUser() {
		const url = '/user';
		const result = await fetch(url, { credentials:'include' });
		const user = await result.json();

		this.setState({ user: user });

		this.render();
	}

	render() {
		const { db, fullPath, user } = this.state;
		return <nav id="topnav">
			<span id="topnav-admin" className="dropdown">
				Menu
				<span className="dropdown-content">
					<a href={`/${db}`}>Home</a>
					<a href="/">Site Root</a>
					<a href={`/${fullPath}/edit`}>Edit this article</a>
					<a href={`/${db}/_menu/edit`}>Edit site menu</a>
					<a href={`/${db}/_style.leeloo/edit`}>Edit site style</a>
				</span>
			</span>
			<span id="topnav-main" className="dropdown-menu" dangerouslySetInnerHTML={({ __html:this.state.menu })}>
			</span>
			<span id="topnav-user" className="dropdown">
				{user.id ? user.name : 'not logged in'}
				<span className="dropdown-content">
					<a href="/user">Profile</a>
					<a href="/login">Login</a>
					<a href="/logout">Logout</a>
				</span>
			</span>
		</nav>;
	}
}
