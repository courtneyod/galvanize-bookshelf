'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
var knex = require('../knex');

router.get('/', function(req, res, next){
	knex('books').orderBy('title', 'asc')
	.then(function(results){

		if(results){
			//console.log(results, 'here are the results')
			res.json(results);
		} else {
			throw new Error('error with results');
		}
	}).catch(function(err){
		res.json(err)
	});
});

router.get('/:id', function(req, res, next){
	knex('books').where('id', req.params.id).orderBy('title', 'desc').first()
	.then(function(results){
		//console.log(results)
		if(results){
			res.json(results);
		} else {
			throw new Error('error with results');
		}
	}).catch(function(err){
		console.log('hi this is the catch\n\n\n\n\n')
		console.log(err)

		res.json(err);
	});
});

router.post('/', function(req, res, next){
	//console.log(req.body.title, req.body.author, 'this is the body')

	knex('books').insert(req.body).returning(['id', 'title', 'author', 'genre', 'description', 'coverUrl'])
	.then(function(results){
	//console.log(results, 'posstttt')
		if(results){
			res.json(results[0]);
		} else {
			throw new Error('error with adding a new book');
		}
	}).catch(function(err){
		res.json(err);
	});
});

router.patch('/:id', function(req, res){
	console.log(req.body, 'this is reqxk')
  knex('books').where('id', req.params.id).update(req.body).returning('*')
    .then(function(book){
    if (book) {
			res.json(book[0]);
    } else {
			throw new Error('error with updating a new book');
		}
  }).catch(function(err){
			res.json(err);
  });
});

router.delete('/:id', function(req, res){
	knex('books').where('id', req.params.id).del().returning('*')
	.then(function(results){
		if(results){
			res.json(results[0])
		} else {
			throw new Error(err)
		}
	}).catch(function(err){
		res.json(err);
	})
})


// Request Method	Request URL	Request Body	Response Status	Response Body
// GET	/books	N/A	200	[{ id: 1, "title": "JavaScript, The Good Parts", ... }, ...]
// GET	/books/1	N/A	200	{ id: 1, "title": "JavaScript, The Good Parts", ... }
// POST	/books	{ "title": "You Don't Know JS: Types & Grammar", ... }	200	{ id: 9, "title": "You Don't Know JS: Types & Grammar", ... }
// PATCH	/books/9	{ description: "Looks at type coercion problems." }	200	{ id: 9, ..., description: "Looks at type coercion problems.", ... }
// DELETE	/books/9	N/A	200	{ "title": "You Don't Know JS: Types & Grammar", ... }

module.exports = router;
