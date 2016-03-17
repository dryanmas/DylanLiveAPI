var Promise = require('bluebird');

/** an abstract as fuck tool for building out the shape of my data **/

/**
	builds out an indiviudal unit of songs or shows 
**/
var build = Promise.coroutine(function *(value, makeArr, countOne) {
	var arr = yield makeArr(value);

	//song data
	if (countOne) {
		for (var i = 0; i < arr.length; i++) {
			arr.count = yield countOne(arr[i].id, value);
		}
	}

	return arr;
})

/**
	builds out full collection of data 
**/
module.exports = Promise.coroutine(function *(collection, makeArr, countOne, countTotal) {
	var data = {};
	
	for (var i = 0; i < collection.length; i++) {
		var value = collection[i].value();
		var key = collection[i].toString();

		if (countTotal) {
			//song data
			var entry = {
				all: yield build(value, makeArr, countOne),
				total: yield countTotal(value)
			}
		} else {
			//show data
			var entry = yield build(value, makeArr, countOne);;
		}
		data[key] = entry; 
	}

	return data;
})
