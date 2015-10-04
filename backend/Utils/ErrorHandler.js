var http = require('http');

exports.logErrors = function(err, req, res, next) {
  console.error(err.stack);
  next(err);
};

exports.clientErrorHandler = function(err, req, res, next) {
  console.log("Caught error");
  console.error(err.stack);
  res.status(500).send('Something broken on backend!');
};

exports.createError = function(errorMessage) {
	var errObj = {
		message: errorMessage
	};
	return errObj;
}