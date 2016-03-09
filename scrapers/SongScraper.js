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
	song.url = $(el).find('.song').find('a').prop('href');
	// song.played = $(el).find('.times').find('a').text();

	return song;
}

var isNew = function(songName){
		//TODO: check database
	return true;
}

var getNextSong = function(songs) {
	if (!songs.length) {
		console.log('donesies')
		return;
	}
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

	song.credit = $('.credit').text().substring(16);
	song.lyrics = parseLyrics($('.lyrics').text()); 

	//TODO: DB logic
	songsDB.push(song);
	getNextSong(songs);
}

var parseLyrics = function(lyrics){
	if (!lyrics) return "";

	//checks for non lyric entries
	var i = lyrics.indexOf("to see a list of");
	if (i >= 0) return "";
	
	//finds first index that is a letter
	var j = 0;
	while (j < lyrics.length && !isLetter(lyrics[j])) j++;

	//finds index of copyright, which will come
	//after the lyrics proper
	var k = lyrics.indexOf("Copyright");
	if (k === -1) 
		k = lyrics.length;

	return lyrics.substring(j, k);
}

var isLetter = function(str) {
	if (typeof str !== 'string') return false;

	str = str.toLowerCase(); 
	return str.length === 1 && str.match(/[a-z]/i);
}

module.exports = getAllSongs;