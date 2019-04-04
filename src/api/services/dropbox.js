const debug = require('debug')('leeloo:dropbox');
const Dropbox = require('dropbox').Dropbox;
const fetch = require('isomorphic-fetch');

const { wrap } = require('../helper/cache');

module.exports = { getArticle };

// TODO: reconcile the collision of the various "path" variables
// TODO: implement caching
// TODO: apply order of preference for file types (or at least yell at the user for having duplicates)
// TODO: do away with db and path, and just use location (maybe?)

async function getArticleOld(db, path) {
	const dropbox = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN, fetch: fetch });

	const fileList = await getFileList(db, dropbox);

	// for now, let's just assume style and menu are in the root, and grab the first match TODO: make this work according to designed logic
	const [ menu, style, article ] = await Promise.all([ 
		getMenu({ db, path, fileList, dropbox }),
		getStyle({ db, path, fileList, dropbox }),
		getArticleContent({ db, path, fileList, dropbox }),
	]);

	return { menu, style, article };

	// const path = `/${process.env.DROPBOX_ROOT}/${req.params[0]}`;
	// debug(`attempting to load path ${path} from Dropbox...`);
	// try {
	// 	const response = await dropbox.filesDownload({ path });
	// 	const fileContent = response.fileBinary.toString('utf8');
	// 	res.send(fileContent);
	// } catch(err) {
	// 	console.error(err);
	// 	res.send(err);
	// }
}
async function getArticle(db, articlePath) {
	const dropbox = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN, fetch: fetch });

	const gfbp = wrap(getFileByPath, ({ db, articlePath }) => `${db}/${articlePath}`);

	// const articlePromise = gfbp({ db, dropbox, articlePath });
	// const menuPromise = gfbp({ db, dropbox, articlePath:'_menu' });
	// const stylePromise = gfbp({ db, dropbox, articlePath:'_style' });
	// const [ article, menu, style ] = await Promise.all([ articlePromise, menuPromise, stylePromise ]);

	// return { menu, style, article };

	return await gfbp({ db, dropbox, articlePath });

}

async function getFileList(db, dropbox) {
	if (!dropbox) throw new Error('dropbox service > getFileList > initialized dropbox instance must be supplied.');

	const path = `/${process.env.DROPBOX_ROOT}/${db}`;
	const recursive = true;

	debug(`getFileList > attempting to load file list for db "${db}". path="${path}"`);

	const response = await dropbox.filesListFolder({ path, recursive });
	const { entries } = response;
	const fileList = entries.map(entry => entry.path_lower);
	debug('getFileList > fileList = ',fileList);
	return fileList;
}

async function getArticleContent({ db, fileList, path, dropbox }) {
	if (!dropbox) throw new Error('dropbox service > getArticle > initialized dropbox instance must be supplied.');


	const articlePath = fileList.find(file => file.match(path));
	debug(`getArticleContent > attempting to load article content for db "${db}" and path "${path}". articlePath="${articlePath}"`);
	if (!articlePath) throw new Error(`dropbox > getArticleContent > no file found matching path "${path}"`);
	const response = await dropbox.filesDownload({ path:articlePath });
	const fileContent = response.fileBinary.toString('utf8');

	return fileContent;
}

async function getFileByPath({ db, dropbox, articlePath }) {
	if (!dropbox) throw new Error('dropbox service > getFileByPath > initialized dropbox instance must be supplied.');

	debug(`getFileByPath > attempting. db="${db}", articlePath="${articlePath}"`);

	// check if the path is already a valid file or folder
	let type;
	const path = `/${process.env.DROPBOX_ROOT}/${db}/${articlePath}`.replace(/\/$/,'');
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

async function getMenu({ db, fileList, path, dropbox }) {
	if (!dropbox) throw new Error('dropbox service > getMenu > initialized dropbox instance must be supplied.');

	debug(`getMenu > attempting to load menu content for db "${db}" and path "${path}"`);

	const menuPath = fileList.find(file => file.match('_menu')); // TODO: look for closest file, apply extension preference, etc
	const response = await dropbox.filesDownload({ path:menuPath });
	const fileContent = response.fileBinary.toString('utf8');

	return fileContent;
}

async function getStyle({ db, fileList, path, dropbox }) {
	if (!dropbox) throw new Error('dropbox service > getStyle > initialized dropbox instance must be supplied.');

	debug(`getStyle > attempting to load style content for db "${db}" and path "${path}"`);

	const stylePath = fileList.find(file => file.match('_style')); // TODO: look for closest file, apply extension preference, etc
	const response = await dropbox.filesDownload({ path:stylePath });
	const fileContent = response.fileBinary.toString('utf8');

	return fileContent;
}