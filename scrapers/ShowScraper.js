var axios = require('axios');
var cheerio = require('cheerio');
var Promise = require('bluebird');

var Show = require('../models/show.js');
var Setlist = require('../models/setlist.js');

var ShowScraper = function() {
	return getStartUrl()
	.then(function(url){
		console.log('start url', url)
		if (!url) return;

		return parseShow(url, []);
	})
	.then(function(shows) {
		return Promise.all(shows.map(saveShow)); 
	})
}

//finds the url of the first show that is missing from the DB
var getStartUrl = function() {
	var firstShow = "http://bobdylan.com/date/1960-05-01-home-karen-wallace/";
	
	return Show.mostRecent()
	.then(function(show) {
		if (!show) return firstShow;
		console.log('most recent show!', show.url)
		return axios.get(show.url)
		.then(function(resp) {
			var $ = cheerio.load(resp.data);
			return $('.next').find('a').prop('href');
		})
	})
}

//gets the show HTML and builds the show object 
//repeats the same routine on the next show
var parseShow = Promise.coroutine(function *(url, shows) {
	var i = 0;

	while (url && i++ < 20){
	 	console.log(url);
		var resp = yield axios.get(url);
		var show = buildShow(resp.data, url);
		
		url = show.nextUrl;
		delete show.nextUrl;

		shows.push(show);
	}
	return shows;
});

//pulls all the information for a show
var buildShow = function(html, url) {
	var $ = cheerio.load(html);

	var show = {};

	show.url = url;
	show.date = $('.details').find('.date').text();
	show.location = $('.details').find('.headline').text();
	show.venue = $('.details').find('.venue').find('a').text();
	
	show.setlist = $('.set-list').find('li').map(function(){
		return $(this).find('a').text();
	}).get();

	show.nextUrl = $('.next').find('a').prop('href');

	return show;
}

//Saves a show and its setlist into the DB
var saveShow = function(show) {
	var setlist = show.setlist;
	delete show.setlist;

	return Show.insert(show)
	.then(function(id) {
		return Setlist.insertList(setlist, id)
	})
}

module.exports = ShowScraper;