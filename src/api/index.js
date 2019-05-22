require('dotenv').load({ path:'/etc/leeloo.env' });

require('./version-check');
require('./validate-env');

// to-do: reconcile auth and user control with controllers/index
const authCtrl = require('./controllers/authCtrl');
const userCtrl = require('./controllers/userCtrl');

const api = require('./controllers');
const express = require('express');
const fallback = require('express-history-api-fallback')
const path = require('path');

const addAuth = require('./helper/addAuth');
const bindSession = require('./helper/bindSession');

const app = express();
const port = process.env.PORT || 3003;
const fileRoot = process.env.STATICFILE_ROOT || path.resolve(__dirname, '../../src');


app.use(require('body-parser').json());

// console.log('__dirname=',__dirname);

bindSession(app);
addAuth(app);


app.use('/', authCtrl);
app.use('/', userCtrl);


// api server
app.use('/api', api);

// static file server for CMS
app.use(express.static(process.env.DOCROOT));

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

// if (!process.env.STATICFILE_INDEX) {
//   process.env.STATICFILE_INDEX = './index.html'
// }

// console.log(`fileRoot=${fileRoot}`)



// bundler
if (!process.env.NO_PARCEL) {
	const Bundler = require('parcel-bundler');
	const file = 'src/index.html'; // Pass an absolute path to the entrypoint here
	const options = {}; // See options section of api docs, for the possibilities

	// Initialize a new bundler using a file and options
	const bundler = new Bundler(file, options);

	// Let express use the bundler middleware, this will let Parcel handle every request over your express server
	app.use(bundler.middleware());
}




// static file server for the app itself
app.use(express.static(fileRoot));
app.use(fallback('index.html', { root:fileRoot }))

app.listen(port, () => console.log(`API listening on port ${port}`));

