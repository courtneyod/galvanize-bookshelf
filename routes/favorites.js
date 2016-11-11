'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
var knex = require('../knex');
const bcrypt = require('bcrypt-as-promised');
const {camelizeKeys, decamelizeKeys} = require('humps');
var cookieParser = require('cookie-parser')

const boom = require('boom');

// YOUR CODE HERE
router.get('/', function(req, res, next){

	knex('favorites')
	.join('users', 'users.id', '=', 'favorites.user_id')
	.join('books', 'books.id', '=', 'favorites.book_id')
	.select('books.created_at', 'books.updated_at', 'favorites.id', 'favorites.book_id', 'favorites.user_id', 'books.title', 'books.author', 'books.description', 'books.cover_url', 'books.genre')
	.then(function(rows){
		if(rows){
			console.log(rows, "kshdfsjdhfjshfjshfjsdjdshfj")
			res.json(rows)

		} else {
			throw new Error('Did not work')
		}
	}).catch(function(err){
		res.set('Content-Type', 'text/plain');
		res.status(401);
		res.send('Unauthorized');
	})
})

// SELECT
// 	tc.table_name, kcu.column_name,
// 	ccu.table_name AS foreign_table_name,
// 	ccu.column_name AS foreign_column_name
// FROM
// 	information_schema.table_constraints AS tc
// 	JOIN information_schema.key_column_usage AS kcu
// 		ON tc.constraint_name = kcu.constraint_name
// 	JOIN information_schema.constraint_column_usage AS ccu
// 		ON ccu.constraint_name = tc.constraint_name
// WHERE constraint_type = 'FOREIGN KEY' AND tc.table_name='favorites';

module.exports = router;
