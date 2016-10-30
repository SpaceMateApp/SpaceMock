var db = require('./db.js');

const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

var mockUser = require('./mockdata/user');


function menu_main() {
	console.log(`
Moonlanding Menu

Select an option:
A) Generate users`);

	rl.question('Selection: [A] ', (answer) => {
		switch (answer.toLowerCase()) {
			case "":
			case "a":
				menu_generate_users();
				break;
			default:
				console.log("INVARIANT BLAH QUIT");
				break;
		}

	});
}

function menu_generate_users() {
	rl.question('How many users? ', (answer) => {
		var count = ~~answer;

		console.log(`Generating ${count} users...`);

		for (var i = 0; i < count; i++) {
			mockUser.generateUser();
		}
	});
}

menu_main();
