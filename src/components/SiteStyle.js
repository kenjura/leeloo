import React from 'react';
import State from '../State.js';

export default class SiteStyle extends React.Component {
	constructor() {
		super();

		this.state = {
			style: ''
		}

		this.populate();
	}

	async populate() {
		const db = State.getDB();
		const url = `/api/article/${db}/_style.leeloo?noTOC=true&noH1=true&noSection=true&db=${db}`;
		const result = await fetch(url);
		const json = await result.json();
		const style = json.wikitext;

		this.setState({ style });
	}

	render() {
		return <style dangerouslySetInnerHTML={({ __html:this.state.style })} />
	}
}

