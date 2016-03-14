var axios = require('axios');
var cheerio = require('cheerio');

var Song = require('../models/song.js');
var Show = require('../models/show.js');
var Setlist = require('../models/setlist.js');

var getShows = function() {
	return startUrl()
	.then(function(url) {
		return parseNextShow(url, buildShow)
	})
}

var startUrl = function() {
	var firstShow = "http://bobdylan.com/date/1960-05-01-home-karen-wallace/";
	
	return Song.mostRecent()
	.then(function(show) {
		if (!show) return firstShow;

		return parseNextShow(show.url, function(html) {
			var $ = cheerio.load(html);

			return getNextUrl($);
		})
	})
}

var parseNextShow = function(url, callback) {
	return axios.get(url)
	.then(function(response){
		return callback(response.data, url);
	})
}

var buildShow = function(html, url) {
	var $ = cheerio.load(html);

	var show = {};

	show.url = url;
	show.date = $('.details').find('.date').text();
	show.location = $('.details').find('.headline').text();
	show.venue = $('.details').find('.venue').find('a').text();
	
	var setlist = $('.set-list').find('li').map(function(){
		return $(this).find('a').text();
	}).get();

	var nextUrl = getNextUrl($);

	return saveShow(show, setlist)
	.then(function() {
		if (nextUrl) {
			return parseNextShow(nextUrl, buildShow);
		} 
	})
}

var saveShow = function(show, setlist) {
	return Show.insert(show)
	.then(function(id) {
		return Setlist.insertList(setlist, id)
	})
}

var getNextUrl = function($){
	return $('.next').find('a').prop('href')
}


module.exports = getShows;