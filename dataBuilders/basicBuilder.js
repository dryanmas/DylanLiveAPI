var Promise = require('bluebird');

/**
	builds out an indiviudal unit of songs or shows 
**/
var buildUnit = Promise.coroutine(function *(unit, genArr, total) {
	var innerArr = yield genArr(unit);

	//song data
	if (total) {
		for (var i = 0; i < innerArr.length; i++) {
			innerArr.count = yield total(innerArr[i].id, unit);
		}
	}

	return innerArr;
})

/**
	an abstract as fuck tool for building out the shape of my data
**/
var builder = Promise.coroutine(function *(arr, genArr, total, innerTotal) {
	var data = {};
	
	for (var i = 0; i < arr.length; i++) {
		var item = arr[i];

		if (total) {
			//song data
			var entry = {
				all: yield buildUnit(item.unit(), genArr, innerTotal),
				total: yield total(item.unit())
			}
		} else {
			//show data
			var entry = yield buildUnit(item.unit(), genArr, innerTotal);;
		}
		data[item.key()] = entry; 
	}

	return data;
})


module.exports = builder;