var express = require('express');
var app = express();

var songScraper = require('./scrapers/SongScraper');
var showScraper = require('./scrapers/ShowScraper');

var songRouter = require('./routers/songRouter');
var showRouter = require('./routers/showRouter');

app.use('/songs/', songRouter);
app.use('/shows/', showRouter);

app.listen(4321);

// songScraper();
 showScraper();