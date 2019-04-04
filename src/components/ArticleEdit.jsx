import React from 'react';

import { read, update } from '../services/articleService';

import './ArticleEdit.scss';

export default class ArticleEdit extends React.Component {
	constructor() {
		super();

		this.state = {
			article: {
				wikitext: ''
			},
			body: '',
		}
	}

	componentDidMount() {
		// const { db, path } = this.props.match.params;
		// read(db, path)
		// 	.then(article => this.setState({ body:article.wikitext }));
	}

	handleChange(body) {
		this.setState({ body });
	}

	save(articlePath, text) {
		const { db, path } = this.props.match.params;
		const { body } = this.state;
		
		update(db, path, body)
			.then(result => alert('result in console'));
	}


	async write() {
		alert('not yet converted to react');
		return;
		const articlePath = window.location.pathname.replace('/edit','');
		const body = this.querySelector('textarea').value;
		this.putArticle(articlePath, body);
	}

	render() {
		return <article-edit id="article-edit" class="mainContent">
			<div className="edit-controls">
				<button secondary="true">Cancel</button>
				<button action="save" primary="true" onClick={event => this.save()}>Save</button>
			</div>
			<textarea value={this.state.body} onChange={event => this.handleChange(event.target.value)}></textarea>
		</article-edit>;
	}
}

