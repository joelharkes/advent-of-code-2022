import fs from 'fs';

interface Node {
    size(): number;
    name(): string;
    parent: Node|undefined;
}

class File implements Node {
    constructor(public parent: Node, private bits: number, private fileName: string){
    }

    size(): number {
        return this.bits;
    }
    name(): string {
        return this.fileName;
    }
}

class Directory implements Node {
    nodes = {} as {[name: string]: Node } ;
    constructor(public parent: Node|undefined, private dirName: string){
    }


    add(node: Node){
        this.nodes[node.name()] = node;
    }

    
    size(): number {
        return Object.values(this.nodes)
            .reduce((a,b) => a + b.size(), 0)
    }

    name(): string {
        return this.dirName;
    }

    dirs(): Directory[] {
        return Object.values(this.nodes)
            .filter(node => node instanceof Directory) as Directory[];
    }
}

function parseInput(input: string): Directory {

    const commands = (text)
        .replace(/\$ /, '') // remove first $\s as this is not split.
        .split(/\n\$\s/g);

    let filePath = '/';
    let currentDir = new Directory(undefined, '');
    const root = currentDir;

    for(const command of commands){
        const [action, ...results] = command.split("\n");

        const [exe, ...params] = action.split(' ');
        if(exe === 'cd'){
            const path = params[0] as string;
            if(path.startsWith('/')){
                filePath = path;
                currentDir = findOrMakeDir(root, filePath) as Directory;
            } else if(path === '..') {
                currentDir = (currentDir.parent ?? currentDir) as Directory;
                filePath = directoryUp(filePath);
            } else {
                filePath += '/' + path;
                currentDir = findOrMakeDir(root, filePath) as Directory;
            }
        } else if (exe === 'ls') {
            results.forEach(x=> {
                var [size, filename] = x.split(' ');
                const file = new File(currentDir, parseInt(size), filename);
                currentDir.add(file);
            });
        }
    }

    return root;
}

function directoryUp(path: string) : string {
    var nodes = path.split('/');
    nodes.pop();
    return nodes.join('/');
}

function findOrMakeDir(root: Directory, path: string):Directory {
    var paths = path.split('/');
    paths.shift();
    return paths.reduce((currentDir, path) => {
        var node = currentDir?.nodes?.[path] as Directory
        if(node instanceof Directory){
            return node;
        }
        const newDir = new Directory(currentDir, path);
        currentDir.add(newDir);
        return newDir;
    }, root); 
}

function findNode(root: Directory, path: string): Node|undefined {
    var paths = path.split('/');
    paths.shift();
    return paths.reduce((currentDir, path) => currentDir?.nodes?.[path] as Directory, root);
}

function filterNodes(root: Directory, filterFn: (dir: Directory) => boolean): Directory[] {
    const children = root.dirs().flatMap(x=> filterNodes(x, filterFn));
    if(filterFn(root)){
        return [root, ...children];
    }
    return children;
}


function forEachNode(root: Directory, eachFn: (dir: Directory) => any): void {
    root.dirs().flatMap(subNode => forEachNode(subNode, eachFn));
    eachFn(root);
}

function reduceNode<T>(root: Directory, reduceFn: (previous: T, newDir: Directory) => T, initial: T){
    let result = initial;
    forEachNode(root, (dir) => {
        result = reduceFn(result, dir);
    });
    return result;
}

var text: string = fs.readFileSync(__dirname + '/data.txt', 'utf-8');
var tree = parseInput(text);

const nodes = filterNodes(tree, x=> x.size() < 100000)
const total = nodes.reduce((sum, node) => sum + node.size(), 0);
console.log(total);

// part 2
const totalSpace = 70000000;
const spaceLeft = totalSpace - tree.size();
const appSize = 30000000;
const neededSpace = appSize - spaceLeft;
const smallestNodeToDelete = reduceNode(tree,(prev,newDir) => {
    var size = newDir.size();
    return size >= neededSpace && size < prev.size()
        ? newDir 
        : prev;
    }, tree);

console.log('smallest delete',smallestNodeToDelete.size());