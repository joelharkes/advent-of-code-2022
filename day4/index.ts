import fs from 'fs';

function assignmentFitsIn(assignment1: Assigment, assignment2: Assigment): boolean {
    return assignment1.min <= assignment2.min && assignment1.max >= assignment2.max
}

function stringToAssignment(text: string): Assigment{
    var [min, max ] = text.split('-');
    return {
        min: parseInt(min), 
        max: parseInt(max)
    }
}
interface Assigment {
    min: number;
    max: number;
}

var text: string = fs.readFileSync(__dirname + '/data.txt', 'utf-8');
var assigments = text.split("\n");
var assignmentsWhichFitInEachother = assigments.filter(assignmentString=> {
    var [assignment1, assignment2 ] = assignmentString.split(',').map(stringToAssignment);
    return assignmentFitsIn(assignment1, assignment2)
     || assignmentFitsIn(assignment2, assignment1);
});

console.log(assignmentsWhichFitInEachother.length);


// part 2
function assignmentOverlaps(assignment1: Assigment, assignment2: Assigment): boolean {
    return assignment1.max >= assignment2.min && assignment2.max >= assignment1.min;
}

var assignmentsThatOverlap = assigments.filter(assignmentString=> {
    var [assignment1, assignment2 ] = assignmentString.split(',').map(stringToAssignment);
    return assignmentOverlaps(assignment1, assignment2);
});
console.log(assignmentsThatOverlap.length);
