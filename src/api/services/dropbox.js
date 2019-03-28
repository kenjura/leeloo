const debug = require('debug')('leeloo:dropbox');
const Dropbox = require('dropbox').Dropbox;
const fetch = require('isomorphic-fetch');

module.exports = { getArticle };

// TODO: reconcile the collision of the various "path" variables
// TODO: implement caching
// TODO: apply order of preference for file types (or at least yell at the user for having duplicates)
// TODO: do away with db and path, and just use location (maybe?)

async function getArticle(db, path) {
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

async function getFileList(db, dropbox) {
	if (!dropbox) throw new Error('dropbox service > getFileList > initialized dropbox instance must be supplied.');
	debug(`getFileList > attempting to load file list for db "${db}"`);

	const path = `/${process.env.DROPBOX_ROOT}/${db}`;
	const recursive = true;

	const response = await dropbox.filesListFolder({ path, recursive });
	const { entries } = response;
	const fileList = entries.map(entry => entry.path_lower);
	// debug('getFileList > fileList = ',fileList);
	return fileList;
}

async function getArticleContent({ db, fileList, path, dropbox }) {
	if (!dropbox) throw new Error('dropbox service > getArticle > initialized dropbox instance must be supplied.');

	debug(`getArticleContent > attempting to load article content for db "${db}" and path "${path}"`);

	const articlePath = fileList.find(file => file.match(path));
	if (!articlePath) throw new Error(`dropbox > getArticleContent > no file found matching path "${path}"`);
	const response = await dropbox.filesDownload({ path:articlePath });
	const fileContent = response.fileBinary.toString('utf8');

	return fileContent;
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