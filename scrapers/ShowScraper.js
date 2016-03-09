var axios = require('axios');
var cheerio = require('cheerio');

//MOCK DB
var showsDB = [];

var getShows = function() {
	parseNextShow(startUrl(), buildShow);
}

var startUrl = function() {
	var firstShow = "http://bobdylan.com/date/1960-05-01-home-karen-wallace/";

	/* TODO: check DB for most recent show and so forth
		var mostRecent = ...
		parseNextShow(mostRecent.url, function(html){
		
		})
	
	*/
	return firstShow; 
}

var parseNextShow = function(url, callback) {
	axios.get(url)
	.then(function(response){
		callback(response.data, url);
	})
}

var buildShow = function(html, url) {
	var $ = cheerio.load(html);

	var show = {};

	var rawDate = $('.details').find('.date').text();

	show.date = formatDate(rawDate);
	show.url = url;
	show.location = $('.details').find('.headline').text();
	show.venue = $('.details').find('.venue').find('a').text();
	show.setlist = $('.set-list').find('li').map(function(){
		return $(this).find('a').text();
	}).get();

	showsDB.push(show);

	var nextUrl = getNextUrl($)

	if (nextUrl) {
		parseNextShow(nextUrl, buildShow);
	} 
}

var formatDate = function(date) {
	var months = {
		'Jan': '01',
		'Feb': '02',
		'Mar': '03',
		'Apr': '04',
		'May': '05',
		'Jun': '06',
		'Jul': '07',
		'Aug': '08',
		'Sep': '09',
		'Oct': '10',
		'Nov': '11',
		'Dec': '12' 
	};

	var month = date.substring(0,3);
	date = date.substring(4);

	var i = date.indexOf(',');
	var day = date.substring(0, i);
	date = date.substring(i+2);
	if (day.length == 1) {
		day = '0' + day;
	}

	date += '-' + months[month];
	date += '-' + day;

	return date;
}

var getNextUrl = function($){
	return $('.next').find('a').prop('href')
}


module.exports = getShows;