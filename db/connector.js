import { MongoClient } from 'mongodb';
import express from 'express';

function getDbUrl() {
	var env = express().get('env');
	 var dbUrlBase = (env === 'development') ? 'localhost' : process.env['PRODUCTION_DB_URL'];
	//var dbUrlBase = process.env['PRODUCTION_DB_URL'];
	return 'mongodb://' + dbUrlBase + ':27017/mongoid';
}

export default new Promise((resolve, reject) => {

	MongoClient.connect(getDbUrl(), (err, database) => {
		if (err) {
			console.log('Unable to connect to the database.');
			console.log(err);
			return reject(err); 
		}
		console.log('Successfully connected to database.');
		resolve(database);
	});

});