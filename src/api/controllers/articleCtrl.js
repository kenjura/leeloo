const article = require('../model/article');
const debug = require('debug')('leeloo:articleCtrl');
const express = require('express');

const { render } = require('../helper/articleRenderer');

const router = express.Router();

router.get(/\/(.*)/, async (req,res) => {
	const articlePath = req.params[0];
	const { filePath, text } = await article.get(articlePath);
	if (!text) res.status(404).send('Article not found');

	const rendered = render({ text, filePath, ...req.query });
	res.send(rendered);
});
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