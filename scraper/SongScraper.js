var axios = require('axios');
var cheerio = require('cheerio');
var Promise = require('bluebird');
var Song = require('./models/song');

var SongScraper = function(){
	var songsUrl = "http://bobdylan.com/songs-played-live/";
	
	return axios.get(songsUrl)
	.then(function(resp) {
		return parseAllSongs(resp.data);
	})
	.then(function(songs) {
		var mapped = songs.map(getSong);
		return Promise.all(mapped);
	})
	.then(function(songs) {
		return Song.insert(songs);
	})
	.then(function() {
		console.log('donesies');
	})
	.catch(function(err) {
		console.log('error:', err)
	})
}

//builds out basic info on each song 
//filters out the songs that are already stored in the DB
var parseAllSongs = function(html) {
	var $ = cheerio.load(html);

	var allSongs = $('.line_detail').map(function(i, el){
		return buildSong($, el);
	}).get();

	return Promise.all(allSongs.map(isNew))
	.then(function(newSongs) {
		return allSongs.filter(function(song, i) {
			return newSongs[i];
		})
	})
}

//grabs the basic title, release, url information for a song
var buildSong = function($, el) {
	var song = {};

	song.title = $(el).find('.song').find('a').text();
	song.release = $(el).find('.release').find('a').text();
	song.url = $(el).find('.song').find('a').prop('href');
	// song.played = $(el).find('.times').find('a').text();

	return song;
}

//checks to see if a song is not already in the DB
var isNew = function(song){
	return Song.byTitle(song.title)
	.then(function(exists) {
		return !exists;
	})
}

//gets HTML for an individual song
//and parses for lyric data 
var getSong = function(song) {
	return axios.get(song.url)
	.then(function(resp) {
		song = parseSong(song, resp.data);
		return song;
	})
}

//grabs credit and lyric information for a song
var parseSong = function(song, html){
	$ = cheerio.load(html);

	song.credit = $('.credit').text().substring(16);
	song.lyrics = parseLyrics($('.lyrics').text());

	return song; 
}

//removes unnecessary text from the lyrics 
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

//returns if a character is a letter or not 
var isLetter = function(str) {
	if (typeof str !== 'string') return false;

	str = str.toLowerCase(); 
	return str.length === 1 && str.match(/[a-z]/i);
}

module.exports = SongScraper;