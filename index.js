var express = require('express');
var app = express();

var songScraper = require('./scrapers/SongScraper');
var showScraper = require('./scrapers/ShowScraper');

app.listen(4321);

// songScraper();
showScraper();