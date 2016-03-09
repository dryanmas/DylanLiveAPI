
exports.up = function(knex, Promise) {
  return Promise.all([
  	knex.schema.createTable('songs', function(song) {
  		song.increments('id').primary();
  		song.string('title').notNullable();
  		song.string('url').notNullable();
  		song.string('credit');
  		song.string('lyrics', 10000);
  		song.string('release'); 
  	}),

  	knex.schema.createTable('shows', function(show) {
  		show.increments('id').primary();
  		show.string('date').notNullable();
  		show.string('url').notNullable();
  		show.string('location');
  		show.string('venue');
  	}),

  	knex.schema.createTable('live_songs', function(live_song) {
  		live_song.increments('id').primary();
  		live_song.integer('song_id').notNullable()
  			.references('id').inTable('songs');
  		live_song.integer('show_id').notNullable()
  			.references('id').inTable('shows');
  		live_song.integer('rank').notNullable();
  	})
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('live_songs'),
    knex.schema.dropTable('shows'),
    knex.schema.dropTable('songs')
  ])
};
