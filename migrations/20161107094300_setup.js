
'use strict'

exports.up = function(knex, Promise) {
  return Promise.all([
  knex.schema.createTable('books', function(table){
  table.increments();
  table.string('title').notNullable().defaultTo("");
  table.string('author').notNullable().defaultTo("");
  table.string('genre').notNullable().defaultTo("");
  table.text('description').defaultTo('').notNullable();
  table.text('coverUrl', 'medium').notNullable().defaultTo("");
  table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
  table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
  //table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('books')
};

//
// │                                          books                                           │
// ├─────────────┬─────────────────────────┬──────────────────────────────────────────────────┤
// │id           │serial                   │primary key                                       │
// │title        │varchar(255)             │not null default ''                               │
// │author       │varchar(255)             │not null default ''                               │
// │genre        │varchar(255)             │not null default ''                               │
// │description  │text                     │not null default ''                               │
// │cover_url    │text                     │not null default ''                               │
// │created_at   │timestamp with time zone │not null default now()                            │
// │updated_at   │timestamp with time zone │not null default now()                            │
// └─────────────┴─────────────────────────┴──────────────────────────────────────────────────┘
