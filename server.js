var Shtein = require('./');
var shtein = new Shtein;

shtein.add('Alex');
shtein.add('Alyx');

var result = Object.create(null);

shtein.leven(result, 'Alx', 2);

console.dir(result);