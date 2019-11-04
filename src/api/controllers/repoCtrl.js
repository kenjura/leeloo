const repo = require('../model/repo');
const debug = require('debug')('leeloo:repoCtrl');
const express = require('express');

const router = express.Router();



router.get('/', async (req, res) => {
	res.send(repo);
});



module.exports = router;