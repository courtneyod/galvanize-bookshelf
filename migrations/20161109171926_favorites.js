exports.up = function(knex, Promise) {
   return Promise.all([
       knex.schema.createTable('favorites', function(table) {
           table.increments()
           table.integer('user_id').notNullable().references('id').inTable('users').onDelete('cascade');
           table.integer('book_id').notNullable().references('id').inTable('books').onDelete('cascade');
           table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
           table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
       })
   ])
};

exports.down = function(knex, Promise) {
   return Promise.all([
       knex.schema.dropTable('favorites')
   ]);
};


// ┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
// │                                         favorites                                               │
// ├────────────────┬─────────────────────────┬──────────────────────────────────────────────────────┤
// │id              │serial                   │primary key                                           │
// │book_id         │integer                  │not null references books(id) on delete cascade index │
// |user_id         │integer                  │not null references users(id) on delete cascade index │
// │created_at      │timestamp with time zone │not null default now()                                │
// │updated_at      │timestamp with time zone │not null default now()                                │
// └────────────────┴─────────────────────────┴──────────────────────────────────────────────────────┘
