'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development'
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();

app.disable('x-powered-by');
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const morgan = require('morgan');

switch (app.get('env')) {
  case 'development':
    app.use(morgan('dev'));
    break;

  case 'production':
    app.use(morgan('short'));
    break;

  default:
}

app.use(bodyParser.json());
app.use(cookieParser());

const path = require('path');

app.use(express.static(path.join('public')));

// CSRF protection
//console.log(process.env.NODE_ENV)
if(process.env.NODE_ENV !== 'development'){
  app.use((req, res, next) => {
    //console.log(req.get('Accept'))
    if (/json/.test(req.get('Accept'))) {
      return next();
    }

    res.sendStatus(406);
  });
}

const books = require('./routes/books');
const favorites = require('./routes/favorites');
const token = require('./routes/token');
const users = require('./routes/users');

app.get("/", function(req, res){
  res.send("woohoo")
})

app.use('/books', books);
app.use('/favorites', favorites);
app.use('/token',token);
app.use('/users', users);

//Update the cookie session secret to use the secret key in the JWT_SECRET environment variable.
app.use(cookieSession({
  name: 'session',
  secret: process.env.JWT_SECRET
}));


app.use((_req, res) => {
  res.sendStatus(404);
});

// eslint-disable-next-line max-params
app.use((err, _req, res, _next) => {
  if (err.output && err.output.statusCode) {
    return res
      .status(err.output.statusCode)
      .set('Content-Type', 'text/plain')
      .send(err.message);
  }

  // eslint-disable-next-line no-console
  console.error(err.stack);
  res.sendStatus(500);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  if (app.get('env') !== 'test') {
    // eslint-disable-next-line no-console
    console.log('Listening on port', port);
  }
});

module.exports = app;
