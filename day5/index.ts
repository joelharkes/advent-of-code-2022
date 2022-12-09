import fs from 'fs';


var text: string = fs.readFileSync(__dirname + '/data.txt', 'utf-8');
const [ cratesText, instructionsText ] = text.split("\n\n");


function makeCrateStacks(input: string) : Map<number, string[]>{
    const crateLines = input.split("\n");
    const container = new Map() as Map<number, string[]>;

    const totalStacks = (crateLines.pop() as string).split('').length / 4;
    for(var index = 0; index < totalStacks; index++){
        container.set(index+1, [] as string[]);
    };

    while(crateLines.length > 0){
        var crates = crateLines.pop()?.split('') as string[];
        for(var index = 0; index < totalStacks; index++){
            var char =  crates[index*4+1];
            if(char !== ' '){
                container.get(index+1)?.push(char);
            }
        };
    }
    return container;
}

const container = makeCrateStacks(cratesText);

const instructions = instructionsText.split("\n");

instructions.forEach(instructionText => {
    var [amount, fromStack, toStack] = instructionText
        .match(/move (\d+) from (\d+) to (\d+)/)
        ?.slice(1,4)
        .map(x=> parseInt(x)) as [number,number,number];
    
    for(var index = 0; index < amount; index++){
        var item = container.get(fromStack)?.pop();
        if(item === undefined){
            break;
        }
        container.get(toStack)?.push(item);
    }
});


var topRow = [...container].map(([key,crates]) => crates[crates.length - 1]).join('');
console.log(topRow);

// part 2
const container2 = makeCrateStacks(cratesText);
instructions.forEach(instructionText => {
    var [amount, fromStack, toStack] = instructionText
        .match(/move (\d+) from (\d+) to (\d+)/)
        ?.slice(1,4)
        .map(x=> parseInt(x)) as [number,number,number];
    
    const from =  container2.get(fromStack) as string[];
    const to =  container2.get(toStack) as string[];

    const items = from.splice(Math.max(from.length-amount, 0), Math.min(from.length, amount));
    for(const item of items){
        to.push(item);
    }
});

var topRow = [...container2].map(([key,crates]) => crates[crates.length - 1]).join('');
console.log(topRow);