const article = require('./articleCtrl');
const express = require('express');

const router = express.Router();

router.use('/article', article);
router.use('/', (req,res) => res.send('api root'));


module.exports = router;