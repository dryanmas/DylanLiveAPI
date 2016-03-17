var Promise = require('bluebird');

/**
	an abstract as fuck tool for building out the shape of my data
**/
var builder = Promise.coroutine(function *(arr, genArr, total, innerTotal) {
	var data = {};
	arr.forEach(function(item) {
		if (total) {
			//song data
			var entry = {
				all: yield buildUnit(item.unit(), genArr, innerTotal),
				total: yield total(item.unit())
			}
		} else {
			//show data
			entry = yield buildUnit(item.unit(), genArr, innerTotal)
		}
		data[item.key()] = entry; 
	})

	return data;
})

/**
	builds out an indiviudal unit of songs or shows 
**/
var buildUnit = Promise.coroutine(function *(unit, genArr, total) {
	var innerArr = yield genArr(unit);

	//song data
	if (total) {
		innerArr.forEach(function(item) {
			innerArr.count = yeild total(item);
		})
	}

	return innerArr;
}))

module.exports = builder;