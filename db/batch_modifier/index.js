require('babel/register');

var MongoClient = require('mongodb').MongoClient,
	UpdateTracker = require('./tracker.js').UpdateTracker,
	updateFunctions = require('./update_functions.js');

/*
 * Batch update a collection.
 * @param {string} url - Database url. Port 27017 is assumed.
 * @param {string} collectionName - Name of collection.
 * @param {function} updateFunction - The function used to update an entry. Takes entry data as argument.
 */
var batchUpdate = function(url, collectionName, updateFunction) {

	MongoClient.connect('mongodb://' + url + ':27017/mongoid', function(err, db) {

		if (err) { return console.log(err); }

		var collection = db.collection(collectionName);

		var tracker = new UpdateTracker();

		tracker.on('done', function() {
			console.log('Closing the database connection.');
			db.close();
		});

		collection.find({}).each(function(err, item) {

			if (err) { return console.log(err); }

			if (item == null) { return tracker.logCursorEnd(); }

			tracker.logFound();

			var query,
				update = updateFunction(item);

			if (item['_id']) {
				query = { '_id': item['_id'] };
			} else {
				query = { id: item['id'] }
			}

			collection.update(query, update, function(err) { 
				if (err) { console.log(err); }
				tracker.logUpdated();
			});


		});

	});

};

batchUpdate(
	'localhost', 
	'projects', 
	updateFunctions.unsetInfoBoxVariables
);