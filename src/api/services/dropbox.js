const debug = require('debug')('leeloo:dropbox');
const Dropbox = require('dropbox').Dropbox;
const fetch = require('isomorphic-fetch');

const { get, put, wrap } = require('../helper/cache');

const MAX_SEQUENTIAL_REQUESTS = 10;

module.exports = { getArticle, getFileList };

// TODO: reconcile the collision of the various "path" variables
// TODO: implement caching
// TODO: apply order of preference for file types (or at least yell at the user for having duplicates)
// TODO: do away with db and path, and just use location (maybe?)

async function getArticle(db, articlePath) {
	const dropbox = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN, fetch: fetch });

	debug(`getArticle > db=${db}, articlePath=${articlePath}`);

	const gfbp = wrap(getFileByPath, ({ db, articlePath }) => `${db}/${articlePath}`);

	// const articlePromise = gfbp({ db, dropbox, articlePath });
	// const menuPromise = gfbp({ db, dropbox, articlePath:'_menu' });
	// const stylePromise = gfbp({ db, dropbox, articlePath:'_style' });
	// const [ article, menu, style ] = await Promise.all([ articlePromise, menuPromise, stylePromise ]);

	// return { menu, style, article };

	return await gfbp({ db, dropbox, articlePath });

}

async function getFileList(db, args={}) {
	const cacheKey = `${db}:file-list`;
	if (get(cacheKey) && !args.noCache) return get(cacheKey);

	const dropbox = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN, fetch: fetch });

	const path = `/${process.env.DROPBOX_ROOT}/${db}`;
	const recursive = true;

	debug(`getFileList > attempting to load file list for db "${db}"`);

	let cursor, has_more = true, requests = 0;
	const fileList = [];
	do {
		const args = { path, recursive };
		requests++;
		debug(`getFileList > request #${requests}`);

		let response;
		if (cursor) response = await dropbox.filesListFolderContinue({ cursor });
		else response = await dropbox.filesListFolder(args);

		const { entries } = response;
		cursor = response.cursor;
		has_more = response.has_more;
		fileList.push(...entries.map(entry => entry.path_lower));
	} while(has_more && requests < MAX_SEQUENTIAL_REQUESTS);

	// clean data
	for (let i = 0; i < fileList.length; i++) {
		fileList[i] = fileList[i].replace(`/${process.env.DROPBOX_ROOT.toLowerCase()}`, '');
	}

	// return
	debug('getFileList > fileList = ',fileList);
	put(cacheKey, fileList);
	return fileList;
}


async function getFileByPath({ db, dropbox, articlePath }) {
	if (!dropbox) throw new Error('dropbox service > getFileByPath > initialized dropbox instance must be supplied.');

	debug(`getFileByPath > attempting. db="${db}", articlePath="${articlePath}"`);

	// check if the path is already a valid file or folder
	let type;
	const path = `/${process.env.DROPBOX_ROOT}/${db}/${articlePath}`.replace(/\/$/,'');
	debug(`getFileByPath > final path to dropbox api: ${path}`);
	try {
		const metadata = await dropbox.filesGetMetadata({ path });
		type = metadata['.tag'];
	} catch(err) {
		if (!err.error) throw err;
		if (err.error && !err.error.error_summary.includes('path/not_found/')) throw err;
		type = 'not_found';
	}
	if (type === 'file') return await getFile({ dropbox, path }); 
	if (type === 'folder') return await getIndex({ dropbox, path });
	if (type === 'not_found') return await searchForFile({ dropbox, path });

	return null;
	// match 2: file matching path with .html, .txt, or .md added
	// if path is a folder, use search with path as path, and query is _home or index
	// if error in metadata, use search with parent path as path, and query is path.substr(path.lastIndexOf('/'))
	// if path is a file, you're done, jsut download it


	// match 3: file matching path with /(_home|index).(html|txt|md)

	async function getFile({ dropbox, path }) {
		const response = await dropbox.filesDownload({ path });
		const fileContent = response.fileBinary.toString('utf8');
		return fileContent;
	}
	async function getIndex({ dropbox, path }) {
		const indexPaths = await search({ dropbox, path, query:'index' });
		if (indexPaths !== null) return await chooseAndDownload({ dropbox, paths:indexPaths });

		const homePaths = await search({ dropbox, path, query:'_home' });
		if (homePaths !== null) return await chooseAndDownload({ dropbox, paths:homePaths });
	}
	async function chooseAndDownload({ dropbox, paths }) {
		const path = choose(paths);
		if (!path) return null;

		const content = await getFile({ dropbox, path });
		const extension = path.substr(path.lastIndexOf('.')+1);

		return { extension, content };

		function choose(arr) {
			return arr.find(a => a.match('.html')) 
				|| arr.find(a => a.match('.md')) 
				|| arr.find(a => a.match('.css')) 
				|| arr.find(a => a.match('.txt')) 
				|| null;
		}
	}
	async function search({ dropbox, path, query }) {
		const result = await dropbox.filesSearch({ path, query });

		if (Array.isArray(result.matches) && result.matches.length === 0 && !result.more) return null;

		const matches = result.matches
			.map(match => match.metadata.path_lower)
			.filter(p => p.match(`${path.toLowerCase()}/${query.toLowerCase()}`.replace(/\/\//g,'/'))); // catches a rare case where there are no matches in this folder, but there are matches in a subfolder, which should be excluded

		return matches.length ? matches : null;
	}
	async function searchForFile({ dropbox, path }) {
		const query = path.substr(path.lastIndexOf('/') + 1); // TODO: account for paths in the form /foo/bar/baz/ (trailing slash falsely indicating folder when really baz is a file) (not sure if this ever happens)
		const paths = await search({
			dropbox,
			path: path.replace(query, ''),
			query,
		});
		if (paths === null) return null;
		return await chooseAndDownload({ dropbox, paths });
	}


}
