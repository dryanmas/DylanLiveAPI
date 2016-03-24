var express = require('express');
var app = express();

var songScraper = require('./scraper/SongScraper');
var showScraper = require('./scraper/ShowScraper');

var songRouter = require('./routers/songRouter');
var showRouter = require('./routers/showRouter');

app.use('/songs/', songRouter);
app.use('/shows/', showRouter);

app.listen(4321);

// songScraper();
showScraper();