exports.up = function(knex, Promise) {
   return Promise.all([
       knex.schema.createTable('users', function(table) {
           table.increments('id').primary();
           table.string('first_name').notNullable().defaultTo('');
           table.string('last_name').notNullable().defaultTo('');
           table.string('email').notNullable().unique();
           table.specificType('hashed_password', 'char(60)').notNullable();
           table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
           table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
       })
   ])
};

exports.down = function(knex, Promise) {
   return Promise.all([
       knex.schema.dropTable('users')
   ]);
};
//┌──────────────────────────────────────────────────────────────────┐
// │                              users                               │
// ├────────────────┬─────────────────────────┬───────────────────────┤
// │id              │serial                   │primary key            │
// │first_name      │varchar(255)             │not null default ''    │
// │last_name       │varchar(255)             │not null default ''    │
// │email           │varchar(255)             │not null unique        │
// |hashed_password |char(60)                 │not null               │
// │created_at      │timestamp with time zone │not null default now() │
// │updated_at      │timestamp with time zone │not null default now() │
// └────────────────┴─────────────────────────┴───────────────────────┘
