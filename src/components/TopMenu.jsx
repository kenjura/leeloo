import PropTypes from 'prop-types';
import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';

import { read as readArticle, render } from '../services/articleService';
import { read as readUser } from '../services/userService';

export default class TopMenu extends React.Component {
	constructor() {
		super();

		// this.state = {
		// 	db: State.getDB(),
		// 	fullPath: window.location.pathname.replace('/edit',''),
		// 	menu: '',
		// 	user: {},
		// };

		// this.innerHTML = this.render();
		// this.populate();
	}

	// async populate() {
	// 	this.populateMenu();
	// 	this.populateUser();
	// }

	// async populateMenu() {
	// 	const db = State.getDB();
	// 	const url = `/api/article/${db}/_menu?noTOC=true&noH1=true&noSection=true&db=${db}`;
	// 	const result = await fetch(url);
	// 	const json = await result.json();

	// 	this.setState({ menu: json.html });

	// 	this.render();
	// }

	// async populateUser() {
	// 	const url = '/user';
	// 	const result = await fetch(url, { credentials:'include' });
	// 	const user = await result.json();

	// 	this.setState({ user: user });

	// 	this.render();
	// }

	render() {
		const { db, fullPath, menu, user } = this.props;

		const menuHtml = render(menu);

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
			<span id="topnav-main" className="dropdown-menu" dangerouslySetInnerHTML={({ __html:menuHtml })}>
			</span>
			<span id="topnav-user" className="dropdown">
				{user && (user.id ? user.name : 'not logged in')}
				<span className="dropdown-content">
					<a href="/user">Profile</a>
					<a href="/login">Login</a>
					<a href="/logout">Logout</a>
				</span>
			</span>
		</nav>;
	}
}

export class TopMenuLoader extends React.Component {
	static propTypes = {
	    history: ReactRouterPropTypes.history.isRequired,
	    location: ReactRouterPropTypes.location.isRequired,
	    match: ReactRouterPropTypes.match.isRequired,
	    route: ReactRouterPropTypes.route, // for react-router-config
	}

	constructor(props) {
		super(props);

		this.state = {
			menu: {},
			loading: false,
		};
	}

	componentDidMount() {
		this.populate();
	}

	async populate() {
		const { location } = this.props;
		const { pathname } = location;
		const db = pathname.substr(0,pathname.indexOf('/',1));
		this.setState({ loading:true });
		const [ menu, user ] = await Promise.all([
			readArticle(`${db}/_menu`),
			readUser(),
		]);
		this.setState({ loading:false, menu, user });
	}

	render() {
		const { location } = this.props;
		const { pathname } = location; // todo: remove and replace this line with something better
		const db = pathname.substr(0,pathname.indexOf('/',1)); // todo: remove and replace this line with something better

		const { loading, menu, user } = this.state;

		if (loading) return 'loading...';

		return <TopMenu db={db} fullPath={location.pathname} menu={menu} user={user} />
	}
}