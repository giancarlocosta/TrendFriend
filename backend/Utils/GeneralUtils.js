exports.getCurrentDate = function() {
	var d = new Date();
	var year = d.getFullYear();;
	var month = d.getMonth() < 10 ? ("0" + d.getMonth()) : d.getMonth();
	var day = d.getDate() < 10 ? ("0" + (d.getDate() - 1)) : (d.getDate() - 1);
	return year + "-" + month + "-" + day;
}

// Make sure date in in correct format and is not older than today
exports.validateDate = function(dateString) {
    var now = new Date();
    if(isNaN(parseInt(dateString.split('-')[0])))
        return false;
    console.log(parseInt(dateString.split('-')[0]));
    console.log(parseInt(dateString.split('-')[1]) - 1);
    console.log(parseInt(dateString.split('-')[2]));
    var dateInQuestion = new Date(parseInt(dateString.split('-')[0]), 
                                  parseInt(dateString.split('-')[1]) - 1, 
                                  parseInt(dateString.split('-')[2]) );
    // Date has to be at least as old as yesterday
    console.log(now + " <= " + dateInQuestion + " ?");
    console.log(Object.prototype.toString.call(dateInQuestion));
    if ( Object.prototype.toString.call(dateInQuestion) === "[object Date]" ) {
        // it is a date
        if ( !(isNaN( dateInQuestion.getTime()) && now > dateInQuestion) ) {
            console.log("VALID DATE");
            return true;
        }
    }
    
    return false;
}