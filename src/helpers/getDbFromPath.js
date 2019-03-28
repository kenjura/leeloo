export default function(path) {
	return path.replace(/^\/([^\/]*).*$/, '$1');
}