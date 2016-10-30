var names = require('./names.json');
var randomMember = require('../util/random_member.js');
var bcrypt = require('bcrypt');
var db = require('../db');

exports.generateUser = function(callback) {
	var firstName = randomMember(names);
	var lastName = randomMember(names);
	var email = `user_${firstName}_${lastName}@spacemate.xyz`;
	var login_token = Math.random().toString(36);
	var gender = Math.random() > 0.5 ? "M" : "F";

	console.log(`${firstName} ${lastName}`);

	bcrypt.hash("Password1", 11, function(err, hashed_password) {
		db.query("INSERT INTO user SET ?",
		{
			name: `${firstName} ${lastName}`,
			hashed_password,
			email,
			gender,
			login_token,
		},
		function (err, data) {
			if(err) {
				console.log("Failure: " + firstName);
				console.log(err);
			} else {
				if (callback) callback();
			}
		});
	});
};
