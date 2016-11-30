var names = require('./names.json');
var traits = require('./traits.json');
var locations = require('./locations.json');
var randomMember = require('../util/random_member.js');
var bcrypt = require('bcrypt');
var db = require('../db');

exports.generateUser = function(callback) {
	var firstName = randomMember(names);
	var lastName = randomMember(names);
	var location = randomMember(locations);
	var email = `user_${firstName}_${lastName}@spacemate.xyz`;
	var login_token = Math.random().toString(36);
	var gender = Math.random() > 0.5 ? "Male" : "Female";

	console.log(`${firstName} ${lastName}`);

	bcrypt.hash("Password1", 11, function(err, hashed_password) {
		db.query("INSERT INTO user SET ?",
		{
			name: `${firstName} ${lastName}`,
			hashed_password,
			email,
			gender,
			login_token,
			actively_looking: 1,
			location: location,
		},
		function (err, data) {
			if(err) {
				console.log("Failure: " + firstName);
				console.log(err);
			} else {
				console.log(data);
				for (var i = 1; i < Math.random() * 10; i++) {
					db.query("INSERT INTO user_traits SET ?",
						{ user_id: data.insertId, trait_string: randomMember(traits) });
				}
				db.query("INSERT INTO user_attributes SET ?",
						 {
							 user_id: data.insertId,
							 same_gender_only: Math.random() > 0.5 ? 0 : 1,
							 desired_roommate_count: Math.floor(Math.random() * 3 + 1),
							 has_place: Math.random() > 0.5 ? 0 : 1,
						 },
						 function(err, res) {
							 if (callback) callback();
						 });
			}
		});
	});
};
