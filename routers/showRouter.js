var router = require('express').Router();
var AllShows = require('../dataBuilder/all').shows;
var ShowBuilder = require('../dataBuilder/builder').all;

//get all songs
router.get('/', function(req, res) {
  AllShows().then(function(songs) {
    res.status(200).send({songs: songs});
  })
  .catch(function() {
    console.log('could not get shows');
    res.sendStatus(400);
  })
})

router.get('/:criterion', function(req, res) {
  var criterion = req.params.criterion;

  ShowBuilder(criterion).then(function(data) {
    res.status(200).send(data);
  })
  .catch(function() {
    console.log('could not get shows');
    res.sendStatus(400);  
  })
})


module.exports = router;