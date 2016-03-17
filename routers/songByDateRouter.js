var router = require('express').Router();
var getData = require('../dataBuilders/dateBuilder').song;

//TODO: MORE MODULARIZED!!!!

router.get('/decade', function(req, res) {
	getData('decade')
	.then(function(data) {
		res.status(200).send(data);
	})
})

router.get('/year', Promise.coutine(function *(req, res) {
	getData('year')
	.then(function(data) {
		res.status(200).send(data);
	})
}))

router.get('/month', function(req, res) {
	getData('month')
	.then(function(data) {
		res.status(200).send(data);
	})

})

module.exports = router;