var mysql = require('mysql');
var dbConfig = require('./config/database');
var connection;

var logger = process.console;

function init() {
	connection = mysql.createConnection(dbConfig);
	connection.connect();
	connection.on('error', function(err) {
		console.log("connection error");
		console.log(err);
		init();
	});
}
init();

module.exports.escape = connection.escape;
module.exports.query = function () {
	var parameters = Array.prototype.slice.call(arguments);
	var retry_count = 0;
	var f = function() {
		try {
			connection.query.apply(connection, parameters);
		} catch (e) {
			console.log(e);
			setup();
			if (retry_count < 5) {
				setTimeout(function() { f(); }, 100);
				retry_count++;
			}
		}
	};
	f();
}


