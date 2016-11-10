'use strict';

const express = require('express');
const {camelizeKeys, decamelizeKeys} = require('humps');
var knex = require('../knex');
const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const router = express.Router();

router.post('/', function(req, res, next){
	const reqBody = decamelizeKeys(req.body);
	var password = req.body.password;
	var email = req.body.email;

	if (!email || !email.trim()) {
    return next(boom.create(400, 'Email must not be blank'));
  }

	if (!password || password.length < 8) {
    return next(boom.create(400, 'Password must be at least 8 characters long'));
  }

	knex('users').where('email', req.body.email)
	.then(function(email){
		if (email.length > 0){
			return next(boom.create(400, 'Email already exists'));
		}
	})

	bcrypt.hash(password, 12)
	 .then((hashedPassword) => {
		 //const insertUser = { email, hashedPassword };
		 var obj = {
			 'firstName': req.body.firstName,
			 'lastName': req.body.lastName,
			 'email': req.body.email,
			 'hashedPassword': hashedPassword
		 }
		 return knex('users').insert(decamelizeKeys(obj), '*');

	 })
    .then((rows) => {

			const user = camelizeKeys(rows[0]);

      delete user.hashedPassword;
      delete user.createdAt;
      delete user.updatedAt;

			if (user, "this is user reght before send"){
			console.log(user);
      res.json(user);
		} else {
			throw new Error('error with adding a new book');
		}
	}).catch(function(err){
		console.log(err);
		res.set('Content-Type', 'text/plain');
		res.status(400);
		res.send(err);
	});
});


module.exports = router;
