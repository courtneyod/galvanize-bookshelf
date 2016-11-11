'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
var knex = require('../knex');
const bcrypt = require('bcrypt-as-promised');
const {camelizeKeys, decamelizeKeys} = require('humps');
var cookieParser = require('cookie-parser')
const boom = require('boom');

router.get('/', function(req, res, next){

	knex('favorites')
	.join('users', 'users.id', '=', 'favorites.user_id')
	.join('books', 'books.id', '=', 'favorites.book_id')
	.select('books.created_at', 'books.updated_at', 'favorites.id', 'favorites.book_id', 'favorites.user_id', 'books.title', 'books.author', 'books.description', 'books.cover_url', 'books.genre')
	.then(function(rows){
		if(rows){
			if(req.cookies['/token'] === 'cookiemonster.something.somwhing'){
				res.json(rows);
			} else {
				res.status(401);
				res.set('Content-Type', 'text/plain');
				res.send('Unauthorized');
			}

		} else {
			throw new Error('Did not work');
		}
	}).catch(function(err){
		res.set('Content-Type', 'text/plain');
		res.status(401);
		res.send('Unauthorized');
	});
});

router.get('/check', function(req, res, next){
	const idFavorites = req.query.bookId;

	knex('favorites')
	.join('users', 'users.id', '=', 'favorites.user_id')
	.join('books', 'books.id', '=', 'favorites.book_id')
	.select('books.created_at', 'books.updated_at', 'favorites.id', 'favorites.book_id', 'favorites.user_id', 'books.title', 'books.author', 'books.description', 'books.cover_url', 'books.genre')
	.then(function(rows){
		if(req.cookies['/token'] === 'cookiemonster.something.somwhing'){
			if(rows){
				if (rows[0].id === parseInt(idFavorites)){
					//console.log(idFavorites)

					res.json(true);
				} else {
					res.json(false);
				}
			} else {
				throw new Error('Did not work');
			}
		} else {
			res.status(401);
			res.set('Content-Type', 'text/plain');
			res.send('Unauthorized');
		}

	}).catch(function(err){
		res.status(401);
		res.set('Content-Type', 'text/plain');
		res.send('Unauthorized');
	});
});

router.post('/', function(req, res, next){
	//console.log(req.body, 'ksdfkdj')
	knex('favorites').insert({'book_id': req.body.bookId, 'user_id': 1}).returning('*')
	.then(function(rows){

		return knex('favorites')
		.join('users', 'users.id', '=', 'favorites.user_id')
		.join('books', 'books.id', '=', 'favorites.book_id')
		.select('favorites.book_id', 'favorites.user_id').where('book_id', req.body.bookId);

	}).then(function(row){
		//console.log(row[0], "court")
		const result = camelizeKeys(row[0]);

		if(req.cookies['/token'] === 'cookiemonster.something.somwhing'){
			res.json(result)
		} else {
			res.status(401);
			res.set('Content-Type', 'text/plain');
			res.send('Unauthorized');
		}


	}).catch(function(err){
		res.status(401);
		res.set('Content-Type', 'text/plain');
		res.send('Unauthorized');
	});
});

router.delete('/', function(req, res, next){
	//console.log(req.body, 'ksdfkdj')
	knex('favorites').where('book_id', req.body.bookId).del().first()
	.then(function(rows){
		delete rows.id
		delete rows.created_at
		delete rows.updated_at
		const result = camelizeKeys(rows);

		if(req.cookies['/token'] === 'cookiemonster.something.somwhing'){
			res.json(result)
		} else {
			res.status(401);
			res.set('Content-Type', 'text/plain');
			res.send('Unauthorized');
		}


	}).catch(function(err){
		res.status(401);
		res.set('Content-Type', 'text/plain');
		res.send('Unauthorized');
	});
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
