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
type TreeGrid = Tree[][];

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
console.log('%d trees are visible', visibleTrees.size);

// part 2

function forEachInGrid<T>(grid: T[][], eachFn: (value: T, y: number, x: number) => void){
    for(var y = 0; y < grid.length; y ++){
        for(var x = 0; x < grid[0].length; x ++){
            eachFn(grid[y][x], y, x);
        }
    }
}


function flatMapGrid<T, TResult>(grid: T[][], mapFn: (value: T, y: number, x: number) => TResult): TResult[]{
    const result = [] as TResult[];
    forEachInGrid(grid, (item,y,x) => result.push(mapFn(item,y,x)))
    return result;
}

type Coordinate = {
    x: number,
    y: number,
}
const isInGrid = (grid: TreeGrid, {y, x}: Coordinate) => x>=0 && y>=0 && y < grid.length && x < grid[0].length

function countSteps(grid: TreeGrid, startLocation: Coordinate, move: (coord: Coordinate) => Coordinate, shouldStop: (tree: Tree) => boolean){
    let location = move(startLocation);
    let steps = 0;
    while(isInGrid(grid, location)){
        // only count a step if there actually was an element in the grid there.
        steps++;
        if(shouldStop(grid[location.y][location.x])){
            break;
        }
        location = move(location);
    }
    return steps;
}

const scenicScores = flatMapGrid(treeGrid, (tree, y, x ) => {
    const GoingNorth = ({x,y}: Coordinate) => ({x, y: y-1} as Coordinate);
    const GoingSouth = ({x,y}: Coordinate) => ({x, y: y+1} as Coordinate);
    const GoingEast = ({x,y}: Coordinate) => ({x: x+1, y} as Coordinate);
    const GoingWest = ({x,y}: Coordinate) => ({x: x-1, y} as Coordinate);
    let startLocation = {x,y} as Coordinate;
    const shouldStop = (treeInLine: Tree) => treeInLine.height >= tree.height;
    const stepsNorth = countSteps(treeGrid, startLocation, GoingNorth, shouldStop);
    const stepsSouth = countSteps(treeGrid, startLocation, GoingSouth, shouldStop);
    const stepsEast = countSteps(treeGrid, startLocation, GoingEast, shouldStop);
    const stepsWest = countSteps(treeGrid, startLocation, GoingWest, shouldStop);

    const points = stepsNorth * stepsSouth * stepsEast * stepsWest;

    return points;
});

const heighestScenicScore = scenicScores.reduce((acc,cur)=> Math.max(acc,cur),0)
console.log("highest scenic score: %d",heighestScenicScore);