export default class State {
	static getDB() {
		// return window.location.pathname.substr(1, window.location.pathname.indexOf('/',1)-1);
		return (window.location.pathname.match(/\/[^\/]+/) || [])[0].substr(1);
	}
}