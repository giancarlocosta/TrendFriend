var http = require('http');
var assert = require('assert');
var Config = require('../config.js');
var response = require('../Utils/ResponseBuilder.js');
var StockActionsHandler = require('./StockActionsHandler.js');
var QueryHandler = require('./QueryHandler.js');
var AuthenticationHandler = require('./AuthenticationHandler.js');
var MongoClient = require('mongodb').MongoClient;
var dbURI = Config.dbURI;
var internetConnection = 1;



/*=============================================================================
 *
 * SIGN-IN & SIGN-UP Strategies 
 *
 ============================================================================*/
exports.signInStrategy = function(username, password, done) {
	AuthenticationHandler.handleSignIn(username, password, done);
};

exports.signUpStrategy = function(username, password, done) {
	AuthenticationHandler.handleSignUp(username, password, done);
};

/*
 * Calls StockActionsHandler methods based on the the stock action
 */
exports.handleStockAction = function(req, res) {
    var option = req.query.action;
    var stockID = req.params.id;
    
    if(option === "follow") {
        StockActionsHandler.followStock(req.user, stockID, function(err, result) {
            if(err)
                res.send(err);
            res.send(result);
        });
    }
	else if(option === "unfollow"){
		StockActionsHandler.unfollowStock(req.user, stockID, function(err, result) {
			if(err)
				res.send(err);
			res.send(result);
		});
	}
};

exports.findAllStocksFromUser = function(req, res) {
    QueryHandler.findAllStocksUserIsFollowing(req.user, function(err, result) {
		if(err)
			res.send(err);
		res.send(result);
	});
};

exports.findStockByIdAndDates = function(req, res) {
	var stockID = req.params.id;
    var startDate = req.query.startDate;

	QueryHandler.findStockByIdAndDates(stockID, startDate, null, function(err, result) {
		if(err) { 
			return res.status(500).send(err); 
		}
		res.send(result);
	});
};


exports.restrict = function(req, res, next) {
    if (!req.user) {
    	console.log("USER isn't logged in.")
    	return res.status(403).send('Access or action denied, please log in'); 
    }
    next();
}