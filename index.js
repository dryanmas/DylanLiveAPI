var express = require('express');
var app = express();

var songScraper = require('./scraper/songScraper');

app.listen(4321);

songScraper();