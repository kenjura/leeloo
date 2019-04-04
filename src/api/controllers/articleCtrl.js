const article = require('../model/article');
const debug = require('debug')('leeloo:articleCtrl');
const dropbox = require('../services/dropbox');
const express = require('express');

const { render } = require('../helper/articleRenderer');

const router = express.Router();


router.get('/file-list', async (req, res) => {
	try {
		const fileList = await dropbox.getFileList('/bertball');
		res.send(fileList);
	} catch(err) {
		console.error(err);
		res.status(500).send('unknown error');
	}
});
router.get(/([^$/]+)(?:\/([^$]+))?/, async (req,res) => {
	try {
		const db = req.params[0];
		const path = req.params[1] || '';
		debug(`articleCtrl > loading article from dropbox, where db="${db}" and path="${path}"`)
		const article = await dropbox.getArticle(db, path);
		if (!article) res.status(404).send(`Article "${db}/${path}" not found.`);
		else res.send(article);
	} catch(err) {
		console.error(err);
		res.send(err);
	}
});
// router.get(/\/(.*)/, async (req,res) => {
// 	let result;
// 	try {
// 		const articlePath = req.params[0];
// 		debug(`getting article with path ${articlePath}`);
// 		result = await article.get(articlePath);

// 		// debug(`filePath = ${filePath}, text.substr(0,50)= ${text.substr(0,50)}`);
// 		if (!result.text) return res.status(404).send('Article not found');
// 	} catch (err) {
// 		console.error('articleCtrl > get > ERROR:', err);
// 		res.send('ERROR');
// 	}

// 	const { filePath, text } = result;

// 	try {
// 		const rendered = render({ text, filePath, ...req.query });
// 		res.send(rendered);
// 	} catch (err) {
// 		console.error('articleCtrl > get > ERROR:', err);
// 		res.send('ERROR');
// 	}
// });
router.put(/\/(.*)/, async (req,res) => {
	const articlePath = req.params[0];
	debug(req.body);
	debug(typeof(req.body));
	const { body } = req.body;
	debug(`PUT article. articlePath=${articlePath}, body=${body.substr(0,25)+body.length>25?'...':''}`);
	const result = await article.put(articlePath, body);
	debug(`result=${result}`);
	if (!result) res.status(404).send('Unknown error');

	res.send(result);
});
router.use('/', (req,res) => res.send('article root'));


module.exports = router;