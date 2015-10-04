var http = require('http');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var Config = require('../config.js');
var Response = require('../Utils/ResponseBuilder.js');
var dbURI = Config.dbURI;
var internetConnection = 1;

/*=============================================================================
 *
 * Adds the stock ID (tickerSymbol) to User's stocksFollowing array.
 * Response: the username and their updated stocksFollowing array in JSON obj
 *
 ============================================================================*/
exports.followStock = function(user, stockID, done) {
	console.log('Following stock: ' + stockID);
	MongoClient.connect(dbURI, function(err, db) {
		if (err) { db.close(); console.log("Error Connecting to server."); return done("DB Error", null); }

		var Users = db.collection('Users');
        Users.update(
            { username: user.username },
            { $addToSet: {stocksFollowing: stockID } }
        );
        db.close();
        if(user.stocksFollowing.indexOf(stockID) == -1)
            user.stocksFollowing.push(stockID);
        return done(null, Response.userInfo(user));
	});
};

/*=============================================================================
 *
 * Removes the stock ID (tickerSymbol) from User's stocksFollowing array.
 * Response: the username and their updated stocksFollowing array in JSON obj
 *
 ============================================================================*/
exports.unfollowStock = function(user, stockID, done) {
    console.log('Unfollowing stock: ' + stockID);
	MongoClient.connect(dbURI, function(err, db) {
		if (err) { db.close(); console.log("Error Connecting to server."); return done("DB Error", null); }

		var Users = db.collection('Users');
        Users.update(
            { username: user.username },
            { $pull: { stocksFollowing: stockID } },
            { multi: true }
        );
        db.close();
        console.log("STOCKS FOLLOWING BEFORE SPLICE: " + user.stocksFollowing);
        user.stocksFollowing.splice( user.stocksFollowing.indexOf(stockID), 1 );
        console.log("STOCKS FOLLOWING AFTER SPLICE: " + user.stocksFollowing);
        return done(null, Response.userInfo(user));	
	});
};