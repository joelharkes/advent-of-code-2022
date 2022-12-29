import fs from 'fs';
import { rootCertificates } from 'tls';



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

class Dir implements Node {
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

    dirs(): Dir[] {
        return Object.values(this.nodes)
            .filter(node => node instanceof Dir) as Dir[];
    }
}

function parseInput(input: string): Dir {

    const commands = (text)
        .replace(/\$ /, '') // remove first $\s as this is not split.
        .split(/\n\$\s/g);

    let filePath = '/';
    let currentDir = new Dir(undefined, '');
    const root = currentDir;

    for(const command of commands){
        const [action, ...results] = command.split("\n");

        const [exe, ...params] = action.split(' ');
        if(exe === 'cd'){
            const path = params[0] as string;
            if(path.startsWith('/')){
                filePath = path;
                currentDir = findOrMakeDir(root, filePath) as Dir;
            } else if(path === '..') {
                currentDir = (currentDir.parent ?? currentDir) as Dir;
                filePath = directoryUp(filePath);
            } else {
                filePath += '/' + path;
                currentDir = findOrMakeDir(root, filePath) as Dir;
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

function findOrMakeDir(root: Dir, path: string):Dir {
    var paths = path.split('/');
    paths.shift();
    return paths.reduce((currentDir, path) => {
        var node = currentDir?.nodes?.[path] as Dir
        if(node instanceof Dir){
            return node;
        }
        const newDir = new Dir(currentDir, path);
        currentDir.add(newDir);
        return newDir;
    }, root); 
}

function findNode(root: Dir, path: string): Node|undefined {
    var paths = path.split('/');
    paths.shift();
    return paths.reduce((currentDir, path) => currentDir?.nodes?.[path] as Dir, root);
}

function findDirsWith(root: Dir, filterFn: (dir: Dir) => boolean): Dir[] {
    const children = root.dirs().flatMap(x=> findDirsWith(x, filterFn));
    if(filterFn(root)){
        return [root, ...children];
    }
    return children;
}

var text: string = fs.readFileSync(__dirname + '/data.txt', 'utf-8');
var tree = parseInput(text);

const nodes = findDirsWith(tree, x=> x.size() < 100000)
const total = nodes.reduce((sum, node) => sum + node.size(), 0);
console.log(total);