'use strict';

const express = require('express');
const router = express.Router();
var knex = require('../knex');
const bcrypt = require('bcrypt-as-promised');
const {camelizeKeys, decamelizeKeys} = require('humps');
var cookieParser = require('cookie-parser')

const boom = require('boom');

// YOUR CODE HERE
router.get('/', function(req, res, next){

	res.json(false);
})

router.post('', function(req, res, next){
	const { email, password } = req.body;

	if (!email || !email.trim()) {
		return next(boom.create(400, 'Email must not be blank'));
	}

	if (!password || password.length < 8) {
		return next(boom.create(400, 'Password must not be blank'));
	}

	//console.log(req.body)
	let user;

	knex('users').where('email', req.body.email).first()
	.then(function(row){
		//console.log(row)
		if (!row) {
			 throw boom.create(400, 'Bad email or password');
		 }

		 user = camelizeKeys(row);
		 return bcrypt.compare(password, user.hashedPassword);

	}).then(function(){

			delete user.hashedPassword;
			delete user.createdAt;
			delete user.updatedAt;

			var opts = {
		    maxAge: 900000,
		    httpOnly: true
		  };
  		res.cookie('some_name', 'some_value', opts);
			//req.session.views = 0;
		//	console.log(res.cookie, "court")

			if (user, "this is user right before send"){
				//console.log(user);
				res.status(200)
				res.json(user);
		} else {
				throw new Error('error with adding a new book');
		}

	}).catch(bcrypt.MISMATCH_ERROR, function(){
		//console.log('WRongggggggggggg')
		throw boom.create(400, 'Bad email or password');
	})
	.catch(function(err){
		res.set('Content-Type', 'text/plain');
		res.status(400);
		res.send('Bad email or password');
	})
})

router.delete('/', (req, res, next) => {
  req.session = null;

  res.setStatus(200);
	res.set('Content-Type', 'text/plain');
	res.send('true');
});

module.exports = router;
