/*
 * Expects a req with a user propert attached (req.user)
 * Returns: JSON object with user info
 */
exports.userInfo = function(user) {
    var userInfo = {
        username: user.username, 
        stocksFollowing: user.stocksFollowing
    };
    return userInfo;
}


/*
result = {
	name: ,
	tickerSymbol: ,
	pricesData: [{'Date': , 'Closing Price': }],
	eventsData: [{'Date': , 'Title': , 'Link': }]
}
*/
exports.buildStockPriceAndEventJSON = function(pricesArray, eventsArray, tickerSymbol) {
	result = {
		name: pricesArray[0]['Name'],
		tickerSymbol: tickerSymbol,
		pricesData: pricesArray,
		eventsData: eventsArray
	};
	return result;
}