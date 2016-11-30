var names = require('./names.json');
var traits = require('./traits.json');
var locations = require('./locations.json');
var sportsTeams = require('./sports.json');
var companies = require('./companies.json');
var biographyTemplates = require('./biographies.json');
var randomMember = require('../util/random_member.js');
var majors = require('./majors.json');
var bcrypt = require('bcrypt');
var db = require('../db');

exports.generateUser = function(callback) {
	var firstName = randomMember(names);
	var lastName = randomMember(names);
	var location = randomMember(locations);
	var email = `user_${firstName}_${lastName}@spacemate.xyz`;
	var login_token = Math.random().toString(36);
	var gender = Math.random() > 0.5 ? "Male" : "Female";
	var bio = randomBio();

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
			biography: bio,
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

exports.randomBio = function randomBio() {
	var verbs = ["hate", "love", "like", "partial to", "enjoy", "disgusted by"];
	var cleanliness = ["Pretty clean.", "Very organized.", "A little dirty.", "Don't mind a mess.", "Slob."];
	var animals = ["cat", "dog", "bird", "fish", "parrot", "tamagachi", "furby", "gorilla"];
	var websites = ["/r/me_irl", "reddit", "facebook", "CNN", "New York Times", "Humble Bundle", "EFF.org", "wikipedia"];
	var template = randomMember(biographyTemplates);
	template = template.replace(/\$TRAIT/g, function() {
		return randomMember(traits).toLowerCase();
	});
	template = template.replace(/\$LOCATION/g, function() {
		return randomMember(locations);
	});
	template = template.replace(/\$MAJOR/g, function() {
		return randomMember(majors);
	});
	template = template.replace(/\$SPORTTEAM/g, function() {
		return randomMember(sportsTeams);
	});
	template = template.replace(/\$COMPANY/g, function() {
		return randomMember(companies);
	});
	template = template.replace(/\$VERB/g, function() {
		return randomMember(verbs);
	});
	template = template.replace(/\$CLEANLINESS/g, function() {
		return randomMember(verbs);
	});
	template = template.replace(/\$ANIMAL/g, function() {
		return randomMember(animals);
	});
	template = template.replace(/\$WEBSITE/g, function() {
		return randomMember(animals);
	});

	return template;
}
