var Shtein = require('./');
var Lazy = require('lazy');

var shtein = new Shtein;
var counter = 0;

Lazy(process.stdin)
	.lines
	.map(String)
	.forEach(function(line) {
		shtein.add(line);
		console.log(counter++);
	})
	.join(function() {
		console.log(shtein.leven(Object.create(null), 'Alex', 1));
	});

process.stdin.resume();