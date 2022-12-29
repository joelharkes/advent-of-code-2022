import fs from 'fs';
import { isConstructorDeclaration } from 'typescript';
var text: string = fs.readFileSync(__dirname + '/data.txt', 'utf-8');

class Tree {
    // use a tree class so we can match on reference ans use a Set.
    constructor(public readonly height: number){}

    isVisible(hightestTreeBefore: number): boolean{
        return this.height > hightestTreeBefore;
    }
}


function reduceAllEast<T, Y>(grid: T[][], initialValue: Y, reduceFn: (accum: Y, current: T ) => Y ){
    const results = [];
    for(var y = 0; y < grid.length; y ++){
        let current = initialValue;
        for(var x = 0; x < grid[0].length; x ++){
           current = reduceFn(current, grid[y][x])
        }
        results.push(current);
    }
    return results;
}


function reduceAllDirections<T, Y>(grid: T[][], initialValue: Y, reduceFn: (accum: Y, current: T ) => Y ){
    for(var y = 0; y < grid.length; y ++){
        let currentEastward = initialValue;
        let currentWestward = initialValue;
        let currentNorthward = initialValue;
        let currentSouthward = initialValue;
        for(var x = 0; x < grid[0].length; x ++){
            currentEastward = reduceFn(currentEastward, grid[y][x])
            currentWestward = reduceFn(currentWestward, grid[y][grid[0].length - x - 1])
            // reverse x and y to go in vertical direction.
            currentSouthward = reduceFn(currentSouthward, grid[x][y])
            currentNorthward = reduceFn(currentNorthward, grid[grid.length - x - 1][y])
        }
    }


var treeGrid = text.split("\n").map(row => row.split('').map(digit=> new Tree(parseInt(digit))));
const visibleTrees = new Set<Tree>();

reduceAllDirections(treeGrid, -1, (currentHeight, currentTree) => {
    if(currentTree.isVisible(currentHeight)){
        visibleTrees.add(currentTree);
        return currentTree.height;
    }
    return currentHeight;
})

console.log('grid size: %d x %d = %d', treeGrid.length, treeGrid[0].length,  treeGrid.length * treeGrid[0].length);
console.log('%d trees are visible', visibleTrees.size)