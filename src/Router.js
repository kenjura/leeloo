export default class Router {
	// static routes = [
	// 	{ name:'articleEdit', pattern: },
	// 	{ name:'articleView', pattern:/\/([^\/]+)/ },
	// ]

	static getCurrentRoute() {
		const { pathname } = window.location;
		return Router.routes.find(r => r.pattern.exec(pathname));
	}
}

class RoutedView extends HTMLElement {
	constructor() {
		super();

		this.style.visibility = 'hidden';

		const { pathname } = window.location;
		// if (!route) throw new Error('invalid route');
		// if (route.name === this.getAttribute('route')) this.style.visibility = 'visible';

		const re = new RegExp(this.getAttribute('pattern'));
		if (re.exec(pathname)) this.style.visibility = 'visible';
	}
}

customElements.define('routed-view', RoutedView);