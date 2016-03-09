var config = require('./knexfile');

var knex = require('knex')(config['development']);

knex.migrate.latest();

module.exports = knex;