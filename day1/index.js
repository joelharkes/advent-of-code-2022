const fs = require('fs');

var text = fs.readFileSync(__dirname + '/data.txt', 'utf-8');
var elves = text.split("\n\n");

const totalCaloriesPerElf = elves
    .map(x=> x.split("\n")
    .map(x=> parseInt(x))
    .reduce((a,b) => a+b ), 0)
var mostCalories = totalCaloriesPerElf.reduce((a,b) => a < b ? b: a, 0);
console.log(mostCalories);

// part 2
var sortedDesc = totalCaloriesPerElf
    .sort((a, b) =>  b - a);
var sumTop3 =sortedDesc
    .slice(0,3)
    .reduce((a,b)=> parseInt(a)+parseInt(b),0);

console.log(sumTop3);