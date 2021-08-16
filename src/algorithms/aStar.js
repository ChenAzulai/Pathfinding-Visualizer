const UP = "up";
const RIGHT = "right";
const LEFT = "left";
const DOWN = "down";
const UP_RIGHT = "up-right";
const DOWN_RIGHT = "down-right";
const UP_LEFT = "up-left";
const DOWN_LEFT = "down-left";

export function aStar(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    if (!startNode || !finishNode || startNode === finishNode) {
        return false;
    }
    const unvisitedNodes = getAllNodes(grid);

    startNode.distance = 0;
    startNode.totalDistance = 0;
    startNode.direction = UP;


    while (!!unvisitedNodes.length) {//casting to boolean
        let currNode = closestNode(grid, unvisitedNodes);
        // sortNodesByDistance(unvisitedNodes);
        // const closestNode = unvisitedNodes.shift();
        // if (currNode.distance === Infinity){
            // return false;
        // }
        currNode.isVisited = true;
        visitedNodesInOrder.push(currNode);
        if (currNode === finishNode) return visitedNodesInOrder;
        updateUnvisitedNeighbors(currNode, grid, finishNode);
    }
}

function closestNode(grid, unvisitedNodes) {
    let currentClosest;
    for (let i = 0; i < unvisitedNodes.length; i++) {

        if (unvisitedNodes[i].isWall === true) {
            unvisitedNodes.splice(i, 1);
        } else if (!currentClosest || currentClosest.totalDistance > unvisitedNodes[i].totalDistance) {
            currentClosest = unvisitedNodes[i];
        } else if (currentClosest.totalDistance === unvisitedNodes[i].totalDistance) {
            if (currentClosest.heuristicDistance > unvisitedNodes[i].heuristicDistance) {
                currentClosest = unvisitedNodes[i];
            }
        }
    }
    unvisitedNodes.splice(unvisitedNodes.indexOf(currentClosest),1);
    console.log('currNode',currentClosest);
    return currentClosest;
}

function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}


function updateUnvisitedNeighbors(node, grid, finishNode) {
    const neighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of neighbors) {
        updateNode(node, neighbor, finishNode);
        // neighbor.isVisited = true;
        // neighbor.distance = node.distance + 1;
        // neighbor.prevNode = node;
    }

}


function updateNode(currNode, neighbor, finishNode) {
    let distance = getDistance(currNode, neighbor);
    if (!neighbor.heuristicDistance) {
        neighbor.heuristicDistance = manhattanDistance(neighbor, finishNode);
    }
    let distToCompare = currNode.distance + distance[0];
    if (distToCompare < neighbor.distance) {
        neighbor.distance = distToCompare;
        neighbor.totalDistance = neighbor.distance + neighbor.heuristicDistance;
        neighbor.prevNode = currNode;
        neighbor.path = distance[1];
        neighbor.direction = distance[2];
    }
}

function getDistance(nodeOne, nodeTwo) {
    const x1 = nodeOne.row;
    const x2 = nodeTwo.row;
    const y1 = nodeOne.col;
    const y2 = nodeTwo.col;


    if (x2 < x1 && y1 === y2) {
        if (nodeOne.direction === UP) {
            return [1, ["f"], UP];
        } else if (nodeOne.direction === RIGHT) {
            return [2, ["l", "f"], UP];
        } else if (nodeOne.direction === LEFT) {
            return [2, ["r", "f"], UP];
        } else if (nodeOne.direction === DOWN) {
            return [3, ["r", "r", "f"], UP];
        } else if (nodeOne.direction === UP_RIGHT) {
            return [1.5, null, UP];
        } else if (nodeOne.direction === DOWN_RIGHT) {
            return [2.5, null, UP];
        } else if (nodeOne.direction === UP_LEFT) {
            return [1.5, null, UP];
        } else if (nodeOne.direction === DOWN_LEFT) {
            return [2.5, null, UP];
        }
    } else if (x2 > x1 && y1 === y2) {
        if (nodeOne.direction === UP) {
            return [3, ["r", "r", "f"], DOWN];
        } else if (nodeOne.direction === RIGHT) {
            return [2, ["r", "f"], DOWN];
        } else if (nodeOne.direction === LEFT) {
            return [2, ["l", "f"], DOWN];
        } else if (nodeOne.direction === DOWN) {
            return [1, ["f"], DOWN];
        } else if (nodeOne.direction === UP_RIGHT) {
            return [2.5, null, DOWN];
        } else if (nodeOne.direction === DOWN_RIGHT) {
            return [1.5, null, DOWN];
        } else if (nodeOne.direction === UP_LEFT) {
            return [2.5, null, DOWN];
        } else if (nodeOne.direction === DOWN_LEFT) {
            return [1.5, null, DOWN];
        }
    }
    if (y2 < y1 && x1 === x2) {
        if (nodeOne.direction === UP) {
            return [2, ["l", "f"], LEFT];
        } else if (nodeOne.direction === RIGHT) {
            return [3, ["l", "l", "f"], LEFT];
        } else if (nodeOne.direction === LEFT) {
            return [1, ["f"], LEFT];
        } else if (nodeOne.direction === DOWN) {
            return [2, ["r", "f"], LEFT];
        } else if (nodeOne.direction === UP_RIGHT) {
            return [2.5, null, LEFT];
        } else if (nodeOne.direction === DOWN_RIGHT) {
            return [2.5, null, LEFT];
        } else if (nodeOne.direction === UP_LEFT) {
            return [1.5, null, LEFT];
        } else if (nodeOne.direction === DOWN_LEFT) {
            return [1.5, null, LEFT];
        }
    } else if (y2 > y1 && x1 === x2) {
        if (nodeOne.direction === UP) {
            return [2, ["r", "f"], RIGHT];
        } else if (nodeOne.direction === RIGHT) {
            return [1, ["f"], RIGHT];
        } else if (nodeOne.direction === LEFT) {
            return [3, ["r", "r", "f"], RIGHT];
        } else if (nodeOne.direction === DOWN) {
            return [2, ["l", "f"], RIGHT];
        } else if (nodeOne.direction === UP_RIGHT) {
            return [1.5, null, RIGHT];
        } else if (nodeOne.direction === DOWN_RIGHT) {
            return [1.5, null, RIGHT];
        } else if (nodeOne.direction === UP_LEFT) {
            return [2.5, null, RIGHT];
        } else if (nodeOne.direction === DOWN_LEFT) {
            return [2.5, null, RIGHT];
        }
    }
}

function manhattanDistance(nodeOne, nodeTwo) {
    const x1 = nodeOne.row;
    const x2 = nodeTwo.row;
    const y1 = nodeOne.col;
    const y2 = nodeTwo.col;

    return (Math.abs(x1 - x2) + Math.abs(y1 - y2));
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            node.distance = Infinity;
            node.totalDistance = Infinity;
            node.heuristicDistance = null;
            nodes.push(node);
        }
    }
    return nodes;
}

export function getNodesInShortestPath(finishNode) {
    const orderedShortestPath = [];
    let currNode = finishNode;
    while (currNode !== undefined) {
        orderedShortestPath.push(currNode);
        currNode = currNode.prevNode;
    }
    return orderedShortestPath;
}