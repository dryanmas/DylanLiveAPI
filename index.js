var express = require('express');
var app = express();

var Scraper = require('./scraper/scraper');

app.listen(4321);

Scraper.getSongsHTML();