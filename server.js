var Shtein = require('./');
var shtein = new Shtein;

shtein.add('Alex');
shtein.add('Alyx');
shtein.add('Blex');

console.log('Alx:2');
console.dir(shtein.leven(Object.create(null), 'Alx', 2));

console.log('Alex:1');
console.dir(shtein.leven(Object.create(null), 'Alex', 1));