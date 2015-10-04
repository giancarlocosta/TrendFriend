/*=============================================================================
 *=============================================================================
 *==================================  EXPRESS =================================
 *=============================================================================
 *===========================================================================*/
var express = require('express');
var path = require('path');
var http = require('http');
var MainHandler = require('./backend/Handlers/MainHandler');
var AuthHandler = require('./backend/Handlers/AuthenticationHandler');
var errorHandler = require('./backend/Utils/ErrorHandler.js')
var funct = require('./backend/Utils/PassportHelpers.js');
var Response = require('./backend/Utils/ResponseBuilder.js');
var app = express();
var exphbs = require('express-handlebars');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local');


app.use(logger('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());
// Session-persisted message middleware
app.use(function(req, res, next){
  var err = req.session.error,
      msg = req.session.notice,
      success = req.session.success;

  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if (err) res.locals.error = err;
  if (msg) res.locals.notice = msg;
  if (success) res.locals.success = success;

  next();
});


app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
app.use(express.bodyParser()),
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(__dirname + '/public')); // ???

// Error handling
app.use(app.router);
app.use(errorHandler.logErrors);
app.use(errorHandler.clientErrorHandler);



/*=============================================================================
 *=============================================================================
 *=================================  PASSPORT  ================================
 *=============================================================================
 *===========================================================================*/
passport.use('local-signin', new LocalStrategy(
  function(username, password, done) {
    MainHandler.signInStrategy(username, password, done);
  }
  
));

// Use the LocalStrategy within Passport to register/"signup" users.
passport.use('local-signup', new LocalStrategy(
  {passReqToCallback : true}, //pass back the request to the callback
  function(req, username, password, done) {
    console.log("\n\n Local SignUp Strategy req: " + req + "\n\n");
    MainHandler.signUpStrategy(username, password, done);
  }
));

//===================  PASSPORT SESSIONS =========================
// Happens the first time you log in. Opens a session 
// and attaches 'user' to each subsequent req so you
// can access the user object in each request with req.user
passport.serializeUser(function(user, done) {
  console.log("Serializing " + user.username);
  done(null, user);
});

// Happens everytime a request is made after the initial login
passport.deserializeUser(function(user, done) {
  console.log("Deserializing " + user.username);
  done(null, user);
});



/*=============================================================================
 *=============================================================================
 *==================================  ROUTES  =================================
 *=============================================================================
 *===========================================================================*/

// Returns collection of Stock Models
app.get('/stocks', AuthHandler.restrict, MainHandler.findAllStocksFromUser);

// Returns stock price and event data packaged in json
app.get('/stock/:id', MainHandler.findStockByIdAndDates);

// Handles action requests of the following form: 
//    stocks/:id/actions?action={followStock, unfollowStock}
app.put('/stock/:id/stockActions', AuthHandler.restrict, MainHandler.handleStockAction);


//=================================  LOGIN/OUT ================================
app.post('/signUp', function(req, res, next) {
  passport.authenticate('local-signup', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.send(info.message); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.send(Response.userInfo(user));
    });
  })(req, res, next);
});

app.post('/login', function(req, res, next) {
  passport.authenticate('local-signin', function(err, user, info) {
    console.log("Login user: " + user);
    if (err) { return next(err); }
    if (!user) { return res.send(info.message); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      console.log(Response.userInfo(user));
      return res.send(Response.userInfo(user));
    });
  })(req, res, next);
});

//logs user out of site, deletes them from session
app.get('/logout', function(req, res){
  var name = "";
  if(req.user) 
    name = req.user.username;
  req.logout();
  req.session.notice = "You have successfully been logged out " + name + "!";
  req.session.destroy(function(err) {
    // cannot access session here
    if(err) console.log("Error destorying session: " + err);
  });
  console.log("*****Logging Out " + name + "*****")
  res.send("Logged out " + name);
});



/*=============================================================================
 *=============================================================================
 *============================  START SERVER  =================================
 *=============================================================================
 *===========================================================================*/
http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});




