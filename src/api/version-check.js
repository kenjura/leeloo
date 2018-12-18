const semver = require('semver');

if (semver.lte(process.version, '8.0.0')) {
	console.error('Sorry, this API requires Node 8+');
	process.exit();
}
