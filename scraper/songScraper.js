var axios = require('axios');
var cheerio = require('cheerio');

//MOCK DB
var songsDB = [];

var getAllSongs = function() {
	var songsUrl = "http://bobdylan.com/songs-played-live/";

	axios.get(songsUrl)
	.then(function(response){
		parseAllSongs(response.data);
	}) 
}

var parseAllSongs = function(html) {
	var $ = cheerio.load(html);

	var allSongs = $('.line_detail').map(function(i, el){
		return buildSong($, el);
	}).get();
	
	var newSongs = allSongs.filter(isNew);

	getNextSong(newSongs);
}

var buildSong = function($, el) {
	var song = {};

	song.title = $(el).find('.song').find('a').text();
	song.release = $(el).find('.release').find('a').text();
	song.played = $(el).find('.times').find('a').text();
	song.url = $(el).find('.song').find('a').prop('href');

	return song;
}

var isNew = function(songName){
		//TODO: check database
	return true;
}

var getNextSong = function(songs) {
	var url = songs[0].url;

	axios.get(url)
	.then(function(response){
		parseSong(songs, response.data);
	})
}

var parseSong = function(songs, html){
	$ = cheerio.load(html);

	var song = songs[0];
	songs = songs.slice(1);

	//TODO: check the lyrics logic
	song.credit = $('.credit').text().substring(16);
	song.lyrics = $('.lyrics').text(); 


	//TODO: DB logic
	songsDB.push(song);
	getNextSong(songs);
}

module.exports = getAllSongs;