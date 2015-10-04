var http = require('http');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var Response = require('../Utils/ResponseBuilder.js');
var Utils = require('../Utils/GeneralUtils.js');
var StockActions = require('./StockActionsHandler.js');
var Config = require('../config.js');
var dbURI = Config.dbURI;
var Quandl = require("quandl");
var quandl = new Quandl({
    auth_token: "dw1BWCJDyy_CEuQbH_hH",
    api_version: 1
});

var internetConnection = 1;


/*=============================================================================
 *=============================================================================
 *==========================  Database Queries  ===============================
 *=============================================================================
 *===========================================================================*/
/* done --> function(err, result) */
exports.findAllStocksUserIsFollowing = function(user, done) {
	MongoClient.connect(dbURI, function(err, db) {
		if (err) { db.close(); return done(err, null); }
		db.collection('Users').findOne({ username: user.username }, function (err, user) {
			if (err) { db.close(); return done(err, null); }
			if (user) {
				var stockModels = [];
				var stocksUserIsFollowing = user.stocksFollowing;
				console.log("Stocks user is following: " + stocksUserIsFollowing );
				for (var i = 0; i < stocksUserIsFollowing.length; i++) {
					var stockModel = {
						_id: stocksUserIsFollowing[i],
						companyName: stocksUserIsFollowing[i], /*TODO: ticker->name*/
						tickerSymbol: stocksUserIsFollowing[i],
						charts: [],
						data: null,
						description: "Placeholder description", /*TODO: ticker->name*/
						picture: null
					};
					stockModels.push(stockModel);
				}	
			}	
			db.close();	
			return done(null, stockModels);
		});
	});
}


/*
 * Query Quandl for stock prices and Yahoo! RSS feed for news events. Return result
 * in following JSON form:
 * result = {
 *    name: ,
 *    tickerSymbol: ,
 *    pricesData: [{'Date': , 'Closing Price': }],
 *    eventsData: [{'Date': , 'Title': , 'Link': }]
 * }
 */
exports.findStockByIdAndDates = function(stockID, startDate, endDate, done) {
    // Get stock prices
    getStockPrices(stockID, startDate, function(err, stockPricesArray) {
        if(err) {console.log("Error getting Stock Prices " + err); return done(err, null);}
        
        // Get stock events/headlines
        getYahooStockEvents(stockID, function(err, eventsArray) {
            if(err) {console.log("Find stock headlines err: " + err);}
            return done(null, Response.buildStockPriceAndEventJSON(stockPricesArray, eventsArray, stockID));
		});
	});
}

exports.clearStockTable = function(req, res) {
    //var stock = req.body;
    //console.log('Adding stock: ' + JSON.stringify(stock));
    MongoClient.connect(dbURI, function(err, db) {
        if (err) { db.close(); res.send(err); }
        console.log("Connected correctly to server.");
        db.collection('Stocks').deleteMany( {}, function(err, results) {
            //console.log(results);
            db.close();
        });
    });
};



/*=============================================================================
 *=============================================================================
 *=============================== 3rd Party Queries  ==========================
 *=============================================================================
 *===========================================================================*/

/*
 * Query Quandl and return an array of stock prices for specified company (stockSymbol)
 * Callback(err, result)
 */
function getStockPrices(stockSymbol, startDate, callback) {
    console.log("User provided Start Date" + startDate);
    if(!startDate) {return callback("Must define start date", null);}
    if(!Utils.validateDate(startDate)) {return callback("Please choose a date that is older than today.", null);}

	quandl.dataset({ source: "WIKI", table: stockSymbol }, { format: "json", trim_start: startDate, trim_end: "2050-09-05"}, function(err, response) {		
		var responseInJSON = JSON.parse(String(response));
        
        // Check for Errors
		if(err) {console.log("GetStockPrices ERROR: " + err); return callback(err, null);}
		if (responseInJSON.hasOwnProperty('error')) {
            console.log("Get Prices error: " + response); 
            return callback("Cannot find information for " + stockSymbol + ". Are you sure that is the correct ticker symbol?", null);
        }
        
        var columnNames = responseInJSON['column_names'];
        var data = responseInJSON['data']; //console.log(data);
        
        // Map from column name -> index of that column in the data arrays
		// Date,Open,High,Low,Close,Volume,Ex-Dividend,Split Ratio,Adj. Open,Adj. High,Adj. Low,Adj. Close,Adj. Volume
        var colNameIndexes = new Array();
        for (var i = 0; i < columnNames.length; i++) { colNameIndexes[columnNames[i]] = i; }
        
        var stockPricesArray = new Array();
        for (var i = 0; i < data.length; i++) {
            var datum = data[i];
            stockPricesArray.push({'Date': datum[colNameIndexes['Date']], 'Closing Price': datum[colNameIndexes['Close']], 'Name': (responseInJSON['name'].split("("))[0]});
        }
		callback(null, stockPricesArray);
    });
};


/*
 * Query Yahoo and return an array of headlines for specified company (stockSymbol)
 */
function getYahooStockEvents(stockSymbol, callback) {
	var feedArray = new Array();
	var rsj = require('rsj');
	rsj.r2j('http://feeds.finance.yahoo.com/rss/2.0/headline?s=' + stockSymbol + '&region=US&lang=en-US',function(json) { 
		var responseInJSON = JSON.parse(String(json));

		for (var i = 0; i < responseInJSON.length; i++) {
			feedArray[i] = {'date': responseInJSON[i]['date'], 'title': responseInJSON[i]['title'], 'link': responseInJSON[i]['link']};
		}

		callback(null, feedArray);
	});
}
