import fs from 'fs';

var text: string = fs.readFileSync(__dirname + '/data.txt', 'utf-8');
const charStream = text.split("");

function findIndexOfUniqueSequence(input: string[], lengthOfSequence: number): number{
    return input.findIndex((val, index) => {
        var groups = input.slice(index, index+lengthOfSequence)
        .reduce((map, char) => {
            if(!map.has(char)){
                map.set(char, [])
            }
            map.get(char)?.push(char);
            return map;
          }, new Map<string, string[]>);
        return groups.size === lengthOfSequence;
    })
}
console.log(findIndexOfUniqueSequence(charStream,4)+4);
// part 2
console.log(findIndexOfUniqueSequence(charStream,14)+14);