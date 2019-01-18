// routes/users.js

var express = require('express');
var secured = require('../middleware/secured');
var router = express.Router();

/* GET user profile. */
// router.get('/user', secured(), function (req, res, next) {
router.get('/user', function (req, res, next) {
	if (!req.user) return res.send('{}');
	const { _raw, _json, ...userProfile } = req.user;
	const obj = Object.assign({}, userProfile, { name:userProfile.emails[0].value });
	res.send(JSON.stringify(obj, null, 2));
});

module.exports = router;