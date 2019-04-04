import React from 'react';

// import { read as readArticle } from '../services/articleService';
import { read as readUser } from '../services/userService';

async function readArticle(path) {
	const uri = `/api/article${path}`;
	const result = await fetch(uri);
	const json = await result.json();
	return json;
}

export default class ArticleLoader extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			articlePath:null,
			db:null,
			fullPath:null,
			user:null,
		}
	}

	componentDidMount() {
		this.populate();
	}

	async populate() {
		const path = window.location.pathname.replace('/edit','');
		const { article, menu, style } = await readArticle(path);
		const user = await readUser();
		this.setState({ article, menu, style, user });
	}

	render() {
		const { article, menu, style, user } = this.state;

		var children = React.Children.map(this.props.children, function (child) {
			return React.cloneElement(child, { article, menu, style, user })
		});

		return <div>{children}</div>
	}
}