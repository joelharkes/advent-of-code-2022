const fs = require('fs');

var text = fs.readFileSync(__dirname + '/data.txt', 'utf-8');
var bags = text.split("\n");

function findDoublePacked(bag){
    var items = bag.split('');
    var compartment1 = items.slice(0, bag.length/2);
    var compartment2 = items.slice(bag.length/2, bag.length);
    
    var doubleItem = compartment1.find(x=> compartment2.includes(x));

    return doubleItem;
}

function mapCharToCode(char){

    var code = char.charCodeAt(0);
    return code < 97 ? code - 64 + 26 : code - 96;
}
var letters = bags.map(findDoublePacked);
var numbers = letters.map(mapCharToCode);
var total = numbers.reduce((a,b)=> a+b, 0);
console.log(total);


// part 2
function chunk(list, length){
    var result = []
    for (let index = 0; index < list.length; index += length) {
        result.push(list.slice(index, index + length));
    }    
    return result;
}
var groups = chunk(bags, 3);


var charPerGroup = groups.map(lines=> {
    var totalItems = {};
    lines.forEach(bag=> {
        var items =  bag.split('');
        return items
            .filter((item, index) => items.indexOf(item) === index)
            .forEach(char=> totalItems[char] = ( totalItems[char] || 0 )+ 1);
    });
    var char3Times = Object.entries(totalItems)
        .find(x=> x[1] === 3)[0];
    return char3Times;
});

var sumGroupBadges = charPerGroup.map(mapCharToCode)
    .reduce((a,b)=> a+b, 0);

console.log(sumGroupBadges);