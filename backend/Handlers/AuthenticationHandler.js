var http = require('http');
var assert = require('assert');
var Config = require('../config.js');
var MongoClient = require('mongodb').MongoClient;
var response = require('../Utils/ResponseBuilder.js');
var bcrypt = require('bcrypt');

var dbURI = Config.dbURI;
var internetConnection = 1;

/*=============================================================================
 *
 * SIGN-IN & SIGN-UP Strategies 
 *
 ============================================================================*/

/*
 * Checks if user is in DB and returns user if they are. Otherwise returns error message
 */
exports.handleSignIn = function(username, password, done) {
    console.log("\n SignInStrategy. User: "+username+", Pass: "+password+" \n");
    MongoClient.connect(dbURI, function(err, db) {
        if (err) { console.log("Error Connecting to server."); return done("DB Error"); }
        
        // Search for user in Users DB
        var Users = db.collection('Users');
        Users.findOne({ username: username }, function (err, user) {
            if (err) { return done("Can't find user."); }
            
            // Check username
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }   
            
            // Check password
            bcrypt.compare(password, user.password, function(err, res) {
                if(res === false)
                    return done(null, false, { message: 'Incorrect password.' });

                return done(null, user);
            });
        });
    });
};


/*
 * Checks if username is already taken. If so then returns a message that saying so.
 * Otherwise creates new user, adds them to DB, and returns user
 */
exports.handleSignUp = function(username, password, done) {
    MongoClient.connect(dbURI, function(err, db) {
        if (err) { console.log("Error Connecting to server."); return done("DB Error"); }

        var Users = db.collection('Users');
        Users.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            
            // If user already exists, then you can't sign up with this username
            if (user) {
                return done(null, false, { message: 'Username is already taken.' });
            }

            bcrypt.hash(password, 10, function(err, hash) {
                // Store hash in your password DB.
                // Create new user 
                var newUser = {
                    _id: null, 
                    username: username, 
                    password: hash, 
                    stocksFollowing:[]
                };
                console.log("Adding new user to Users DB.");
                Users.insert( newUser, function(err, result) {
                    if (err) { return done(err); }
                    db.close();
                    return done(null, newUser);
                }); 
            });           
        });
    });
}

/*
 * Used on routes to restrict access to certain pages if user not logged in
 */ 
exports.restrict = function(req, res, next) {
    if (!req.user) {
      console.log("USER isn't logged in.")
      return res.status(403).send('Access or action denied, please log in'); 
    }
    next();
}
