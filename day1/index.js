const fs = require('fs');

var text = fs.readFileSync(__dirname + '/data.txt', 'utf-8');
var elves = text.split("\n\n");

const totalCaloriesPerElf = elves
    .map(x=> x.split("\n")
    .reduce((a,b) => parseInt(a) + parseInt(b) ), 0)
var mostCalories = totalCaloriesPerElf.reduce((a,b) => a < b ? b: a, 0);
console.log(x);