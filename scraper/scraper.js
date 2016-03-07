var axios = require('axios');
var cheerio = require('cheerio');

var songsUrl = "http://bobdylan.com/songs-played-live/";

var Scraper = {};

Scraper.getSongsHTML = function() { 
	axios.get(songsUrl)
	.then(function(response){
		siftSongs(response.data);
	}) 
}

var siftSongs = function(html) {
	var $ = cheerio.load(html);
	
	var songAttr = function(el, className) {
		return $(el).find(className).find('a').text();
	}

	var parseSong = function(i, songEl) {
		var song = {};

 		song.title = songAttr(this, '.song');
 		song.release = songAttr(this, '.release')
		song.played = songAttr(this, '.times');

		return song;
	}

	var songs = $('.line_detail').map(parseSong).get();
	//TODO: enter songs into database
}

// Scraper.getShows 



module.exports = Scraper;