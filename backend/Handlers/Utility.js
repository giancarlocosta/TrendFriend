
exports.getCurrentDate = function() {
	var d = new Date();
	var year = d.getFullYear();;
	var month = d.getMonth() < 10 ? ("0" + d.getMonth()) : d.getMonth();
	var day = d.getDate() < 10 ? ("0" + (d.getDate() - 1)) : (d.getDate() - 1);
	return year + "-" + month + "-" + day;
}