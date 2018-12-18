require('dotenv').load({ path:'/etc/leeloo.env' });

require('./version-check');

const api = require('./controllers');
const express = require('express');
const fallback = require('express-history-api-fallback')
const path = require('path');

const app = express();
const port = process.env.PORT || 3003;
const fileRoot = process.env.STATICFILE_ROOT || path.resolve(__dirname, '../../src');


app.use(require('body-parser').json());

// console.log('__dirname=',__dirname);

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

// static file server for the app itself
app.use(express.static(fileRoot));
app.use(fallback('index.html', { root:fileRoot }))

app.listen(port, () => console.log(`API listening on port ${port}`));

