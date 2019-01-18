module.exports = function(app) {


  var session = require('express-session');

  // config express-session
  var sess = {
    secret: process.env.AUTH0_CLIENT_SECRET,
    cookie: {},
    resave: false,
    saveUninitialized: true
  };

  if (app.get('env') === 'production') {
    sess.cookie.secure = true; // serve secure cookies, requires https
  }

  app.use(session(sess));
  console.log('SESSION IS BOUND');
}