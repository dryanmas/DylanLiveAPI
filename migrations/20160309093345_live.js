
exports.up = function(knex, Promise) {
  return Promise.all([
  	knex.schema.createTable('songs', function(song){
  		song.increments('id').primary();
  		song.string('title').notNullable();
  		song.string('url').notNullable();
  		song.string('credit');
  		song.string('lyrics', 10000);
  		song.string('release'); 
  	})
  ])
};

exports.down = function(knex, Promise) {
  
};
