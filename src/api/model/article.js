// to-do: make this a DAO for local file system, then replace with locally-cached Dropbox proxy

const debug = require('debug')('leeloo:articleModel');
const fs = require('fs');
const path = require('path');

const { promisify } = require('util');

const access = promisify(fs.access);
const stat = promisify(fs.stat);

module.exports = { get, put }

async function get(virtualPath) {
	try {
		const filePath = await resolveVirtualPath(virtualPath);
		debug(`get > filePath=${filePath}`);
		if (!filePath) return {};
		const text = await read(filePath);
		return {
			filePath,
			text,
		}
	} catch (err) {
		console.error('articleModel > get > ERROR:', err);
		return {};
	}
}

async function put(virtualPath, body) {
	const filePath = await resolveVirtualPath(virtualPath);
	const result = fs.writeFileSync(filePath, body);
	return result;
}

async function read(filePath) {
	const result = fs.readFileSync(filePath);
	// const result = await promisify(file.readFile)(filePath);
	return result.toString();
}

async function resolveVirtualPath(virtualPath) { // to-do: move me into a helper
	const docRoot = process.env.DOCROOT;
	if (!docRoot) throw new Error('No docRoot, no articles, bub.');

	try {
		return await attempt()
			|| await attempt({ extension:'.html' })
			|| await attempt({ extension:'.md' })
			|| await attempt({ extension:'.css' })
			|| await attempt({ extension:'.txt' })
			|| await attempt({ extraPath:'_index.html' })
			|| await attempt({ extraPath:'_index.md' })
			|| await attempt({ extraPath:'_index.txt' })
			|| await attempt({ extraPath:'_home.txt' }) // to-do: deprecate this
			|| null;
	} catch(err) {
		console.error('articleModel > resolveVirtualPath > ERROR:', err);
		return null;
	}

	// // exact file
	// if (exists(path.resolve(docRoot, path))) return path.resolve(docRoot, path);

	// // exact file, sans extension
	// if (exists(path.resolve(docRoot, path, '.html'))) return path.resolve(docRoot, path, '.html');
	// if (exists(path.resolve(docRoot, path, '.md'))) return path.resolve(docRoot, path, '.md');
	// if (exists(path.resolve(docRoot, path, '.txt'))) return path.resolve(docRoot, path, '.txt');

	// // path to a filder with an index
	// if (exists(path.resolve(docRoot, path, '/index.html'))) return path.resolve(docRoot, path, '/index.html');
	// if (exists(path.resolve(docRoot, path, '/index.md'))) return path.resolve(docRoot, path, '/index.md');
	// if (exists(path.resolve(docRoot, path, '/index.txt'))) return path.resolve(docRoot, path, '/index.txt');

	// return null;

	async function attempt({ extension, extraPath }={}) {
		debug(`attempt: extension=${extension}, extraPath=${extraPath}`);
		const fullPath = path.resolve(docRoot, extension ? `${virtualPath}${extension}` : virtualPath, extraPath||'')
		// console.log(`resolves to ${fullPath}`);
		return await exists(fullPath);
	}
}

async function exists(filePath) {
	// fs.access(filePath, fs.constants.F_OK, err => {
	// 	if (err) console.error('ERROR',err);
	// 	if (err) return null;
	// 	console.log(filePath, 'happy');
	// 	return filePath;
	// });
	try {
		// console.log(`trying ${filePath}`);
		await stat(filePath);
		if (fs.lstatSync(filePath).isDirectory()) return null; // to-do: async plz
		// console.log(`success for ${filePath}`);
		return filePath;
	} catch(e) {
		// console.error(`failed ${filePath}`);
		return null;
	}
}


// refer to docs/pathLogic.md for clarification