'use strict';

module.exports = {
  development: {
    client: 'postgresql',
    connection: 'postgres://localhost/bookshelf_dev',
    pool: {
      min: 1,
      max: 1
    }
  },

  test: {
    client: 'postgresql',
    connection: 'postgres://localhost/bookshelf_test',
    pool: {
      min: 1,
      max: 1
    }
  },

  production: {
    client: 'postgresql',
    connection: 'postgres://localhost/bookshelf_dev',
    pool: {
      min: 1,
      max: 1
    }
  }
};
