var axios = require('axios');
var cheerio = require('cheerio');

var songsUrl = "http://bobdylan.com/songs-played-live/";

var Scraper = {};

Scraper.getShows = function() {
	var shows = [];
	parseShowUrl(firstShowUrl, shows);
}

var parseShowUrl = function(url, shows) {
	axios.get(url)
	.then(function(response){
		siftShow(response.data, shows, url);
	})
}

var siftShow = function(html, shows, url) {
	var $ = cheerio.load(html);

	var show = {};

	show.url = url;
	//TODO: format date
	show.date = $('.details').find('.date').text();
	show.location = $('.details').find('.headline').text();
	show.venue = $('.details').find('.venue').find('a').text();
	show.setlist = $('.set-list').find('li').map(function(){
		return $(this).find('a').text();
	}).get();

	shows.push(show);

	var nextUrl = $('.next').find('a').prop('href');

	if (nextUrl) {
		parseShowUrl(nextUrl, shows);
	} else {
		console.log('random show', shows[50]);
		//enter into DB
	}

}





module.exports = Scraper;