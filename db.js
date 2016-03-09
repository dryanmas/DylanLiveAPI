var config = require('./knexfile');

var env = process.env.NODE_ENV || 'development';
console.log('Database env:', env);

var knex = require('knex')(config[env]);

// knex.migrate.latest([config]);

module.exports = knex;