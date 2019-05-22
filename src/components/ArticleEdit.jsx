import React from 'react';

import { read, update } from '../services/articleService';

import './ArticleEdit.scss';

export default class ArticleEdit extends React.Component {
	constructor() {
		super();
	}

	render() {
		const { article, onCancel, onSave } = this.props;

		return <article-edit id="article-edit" class="mainContent">
			<div className="edit-controls">
				<button secondary="true" onClick={event => onCancel()}>Cancel</button>
				<button action="save" primary="true" onClick={event => onSave('nope')}>Save</button>
			</div>
			<textarea value={article.content} onBasdfChange={event => this.handleChange(event.target.value)}></textarea>
		</article-edit>;
	}
}


export class ArticleEditLoader extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			article: {},
			loading: false,
		};

		this.onCancel = this.onCancel.bind(this);
		this.onSave = this.onSave.bind(this);
	}

	componentDidMount() {
		this.populate();
	}

	onCancel() {
		alert('cancel not yet implemented');
	}

	onSave(body) {
		const { location } = this.props;
		const path = location.pathname;
		
		update(path, body)
			.then(result => alert('result in console'));
	}

	async populate() {
		const { location } = this.props;
		this.setState({ loading:true });
		const article = await read(location.pathname);
		this.setState({ article, loading:false });
	}

	render() {
		const { article, loading } = this.state;

		if (loading) return <div>loading...</div>;
		return <ArticleEdit article={article} onSave={this.onSave} onCancel={this.onCancel} />
	}
}