import React from 'react';
import State from '../State.js';

import { Button } from 'antd';
import { read, render, renderTOC } from '../services/articleService';
import { wikiToHtml } from '../api/helper/WikiUtil';

import './ArticleView.scss';

export default class ArticleView extends React.Component {
	constructor() {
		super();

		this.state = {
			html: '',
			status: 200,
			tocHtml: '',
			wikitext: '',
		}

    	this.myRef = React.createRef();

    	this.handleEdit = this.handleEdit.bind(this);
	}

	componentDidMount() {
		// const { db, path } = this.props.match.params;
		// read(db, path || '_home')
		// 	.then(({ html, status, tocHtml, wikitext }) => this.setState({ html, status, tocHtml, wikitext }));
	}

	handleEdit() {
		const { handleEdit } = this.props;
		if (!handleEdit || typeof(handleEdit) !== 'function') throw new Error('articleView > handleEdit > props.handleEdit was not provided.');
		else handleEdit();
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
		
	}

	render() {
		const { article, fileList } = this.props;

		const articleHtml = render(article);
		const tocHtml = renderTOC(article);
		const status = 200;

		setTimeout(() => sectionify(this.myRef.current));
		setTimeout(() => fileListIfy(this.myRef.current));

		return <div id="article-view-container">
			<nav id="toc" className="dropdown-menu" dangerouslySetInnerHTML={({ __html:tocHtml })} />
			<article 
				ref={this.myRef} 
				id="article-view" 
				className="mainContent" 
				dangerouslySetInnerHTML={({ __html:articleHtml })}>
			</article>
			<Button id="article-edit-button" icon="edit" onClick={this.handleEdit}>Edit this article</Button>
		</div>;
	}
}

export class ArticleViewLoader extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			article: {},
			loading: true,
		};

		this.handleEdit = this.handleEdit.bind(this);
	}

	componentDidMount() {
		this.populate();
	}

	handleEdit() {
		const { history, location } = this.props;
		history.push(`${location.pathname}/edit`);
	}

	async populate() {
		const { location } = this.props;
		this.setState({ loading:true });
		const article = await read(location.pathname);
		this.setState({ article, loading:false });
	}

	render() {
		const { fileList } = this.props;
		const { article } = this.state;
		
		return <ArticleView article={article} fileList={fileList} handleEdit={this.handleEdit} />
	}
}


function fileListIfy(node) {
	const links = node.querySelectorAll('a');
	const activeLinks = links.filter(link => fileList.includes(link.getAttribute('href').toLowerCase()));
	activeLinks.forEach(link => link.setAttribute('active','true'));
}

function sectionify(node) {
	const elements = node.children;
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
	node.innerHTML = '';
	sections.forEach(section => {
		let element = document.createElement('section');
		element.className = 'sectionOuter';
		section.forEach(e => element.appendChild(e));
		node.appendChild(element);
	})
}