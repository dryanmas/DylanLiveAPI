var axios = require('axios');
var cheerio = require('cheerio');
var songsUrl = "http://bobdylan.com/songs-played-live/";

//MOCK DB
var songs = [];

var getAllSongs = function() { 
	axios.get(songsUrl)
	.then(function(response){
		parseAllSongs(response.data);
	}) 
}

var parseAllSongs = function(html) {
		var $ = cheerio.load(html);

	var allSongs = $('.line_detail').map(parseSong).get();
	var newSongs = allSongs.filter(isNew)

	getFirstSong(songs);
}

var buildSong = function($) {
	var song = {};

	song.title = $(el).find('.song').find('a').text();
	song.release = $(el).find('.release').find('a').text();
	song.played = $(el).find('.times').find('a').text();
	song.url = $(this).find('.song').find('a').prop('href');

	return song;
}

var isNew = function(songName){
		//TODO: check database
	return true;
}

var getFirstSong = function(songs) {
	var url = songs[0].url;
	
	axios.get(url)
	.then(function(response){
		parseSong(songs, response.data);
	})
}

var parseSong = function(songs, html){
	$ = cheerio.load(html);

}
