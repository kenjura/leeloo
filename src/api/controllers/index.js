const article = require('./articleCtrl');
const repo = require('./repoCtrl');
const express = require('express');

const router = express.Router();

router.use('/article', article);
router.use('/repo', repo);
router.use('/', (req,res) => res.send('api root'));


module.exports = router;