import React, {Component, useState} from 'react';
import Node from './Node/Node'
import {dijkstra, getNodesInShortestPath} from '../algorithms/dijkstra'
import './PathfindingVisualizer.css'

import 'react-dropdown/style.css';


import {aStar} from "../algorithms/aStar";

// const startNodeRow = 10;
// const startNodeCol = 15;
// const finishNodeRow = 10;
// const finishNodeCol = 35;
//
const GRID_LENGTH = 50;
const GRID_HEIGHT = 20;


export default class PathfindingVisualizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            currentAlgorithm: '',
            mouseIsPressed: false,
            pressedNodeType: '',
            startNodeRow: 10,
            startNodeCol: 15,
            finishNodeRow: 10,
            finishNodeCol: 35,
        };
    }

    componentDidMount() {
        const startRow = this.state.startNodeRow;
        const startCol = this.state.startNodeCol;
        const finishRow = this.state.finishNodeRow;
        const finishCol = this.state.finishNodeCol;
        const grid = getInitGrid(startRow, startCol, finishRow, finishCol);
        this.setState({grid});
    }

    handleMouseDown(row, col) {
        // console.log('handleMouseDown', row, col);
        // console.log('state', this.state.startNodeRow, this.state.startNodeCol);
        console.log('Down ', this.state.startNodeRow, this.state.startNodeCol, row, col);

        if (this.state.grid[row][col].isStart) {
            const newGrid = getNewGridStartChanged(this.state.grid, row, col);
            this.setState({grid: newGrid, pressedNodeType: 'start', mouseIsPressed: true});

        } else {
            const newGrid = getNewGridWithWallToggle(this.state.grid, row, col);
            this.setState({grid: newGrid, mouseIsPressed: true});
        }

    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        let newGrid;
        if (this.state.pressedNodeType !== 'start') {
            newGrid = getNewGridWithWallToggle(this.state.grid, row, col);
            this.setState({grid: newGrid});
        }
    }

    handleMouseUp(row, col) {
        let newGrid;
        if (this.state.pressedNodeType === 'start') {
            newGrid = getNewGridStartChanged(this.state.grid, row, col);

            this.setState({
                grid: newGrid,
                mouseIsPressed: false,
                pressedNodeType: '',
                startNodeRow: row,
                startNodeCol: col,
            });

        } else
            this.setState({mouseIsPressed: false});
    }

    animate(visitedNodesInOrder, nodesInShortestPath) {

        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShorterPath(nodesInShortestPath);
                }, 10 * i)
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                const nodeProp = this.state.grid[node.row][node.col];
                if (!nodeProp.isStart && !nodeProp.isFinish)
                    document.getElementById(`node-${node.row}-${node.col}`).className = `node node-visited`;
            }, 10 * i);
        }
    }


    animateShorterPath(nodesInShortestPath) {
        for (let i = 0; i < nodesInShortestPath.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPath[i];
                const nodeProp = this.state.grid[node.row][node.col];
                if (!nodeProp.isStart && !nodeProp.isFinish)
                    document.getElementById(`node-${node.row}-${node.col}`).className = `node node-shortest-path`;
            }, 15 * i);
        }
    }

    visualize() {
        const {grid} = this.state;
        let visitedNodesInOrder = [];
        const startNode = grid[this.state.startNodeRow][this.state.startNodeCol];
        const finishNode = grid[this.state.finishNodeRow][this.state.finishNodeCol];
        if (this.state.currentAlgorithm === 'Dijkstra')
            visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        else
            visitedNodesInOrder = aStar(grid, startNode, finishNode);
        console.log(visitedNodesInOrder);
        const nodesInShortestPath = getNodesInShortestPath(finishNode);
        this.animate(visitedNodesInOrder, nodesInShortestPath);
    }

    clean() {
        window.location.reload();
    }

    handleSelectChange = (event) => {
        this.setState({
            currentAlgorithm: event.target.value
        })
    };

    handleVisualize = () => {
        console.log('visualize');
        if (this.state.currentAlgorithm === '') {
            window.alert('Choose Algorithm to visualize!');
            return;
        }
        this.visualize();
    };

    render() {
        const {grid, mouseIsPressed} = this.state;

        return (
            <>
                <div className="toolbar">
                    <div className="dropdown-bar">
                        <select id="dropdown" onClick={this.handleSelectChange}>
                            <option selected disabled value="">Algorithms</option>
                            <option value="Dijkstra">Dijkstra's Algorithm</option>
                            <option value="A*">A* Search</option>
                        </select>
                    </div>
                    <div className="actions-btn">
                        <ul className="nav">
                            <li id="visualize-btn">
                                <a href="#" onClick={() => {this.handleVisualize()}}>
                                    {this.state.currentAlgorithm === '' ? 'Visualize!' : 'Visualize ' + this.state.currentAlgorithm + '!'}
                                </a>
                            </li>
                            <li id="clean-btn">
                                <a href="#" onClick={() => this.clean()}>
                                    Clear Board
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div id='mainText'>
                    <ul>
                        <li>
                            <div className="start"/>
                            Start Node
                        </li>
                        <li>
                            <div className="target"/>
                            Target Node
                        </li>
                        <li>
                            <div className="unvisited"/>
                            Unvisited Node
                        </li>
                        <li>
                            <div className="visited"/>
                            Visited Nodes
                        </li>
                        <li>
                            <div className="shortest-path"/>
                            Shortest-path Node
                        </li>
                        <li>
                            <div className="wall"/>
                            Wall Node
                        </li>
                    </ul>
                </div>
                <div id="algorithmDescriptor">To set a wall, select and drag the mouse over the nodes.</div>

                <div className="grid">
                    {grid.map((row, rowInd) => {
                        return (<div key={rowInd}>
                                {row.map((node, nodeInd) => {
                                    const {col, row, isStart, isFinish, isWall, isVisited} = node;
                                    return (
                                        <Node key={nodeInd}
                                              col={col}
                                              row={row}
                                              isStart={isStart}
                                              isFinish={isFinish}
                                              isVisited={isVisited}
                                              isWall={isWall}
                                              mouseIsPressed={mouseIsPressed}
                                              onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                              onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                                              onMouseUp={() => this.handleMouseUp(row, col)}
                                        >
                                        </Node>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </>
        );
    }


}


const getInitGrid = (startRow, startCol, finishRow, finishCol) => {

    const grid = [];
    for (let row = 0; row < GRID_HEIGHT; row++) {
        const currRow = [];
        for (let col = 0; col < GRID_LENGTH; col++) {
            currRow.push(createNode(col, row, startRow, startCol, finishRow, finishCol));
        }
        grid.push(currRow);
    }
    return grid;
};


const createNode = (col, row, startRow, startCol, finishRow, finishCol) => {

    return {
        col,
        row,
        isStart: row === startRow && col === startCol,
        isFinish: row === finishRow && col === finishCol,
        distance: Infinity,
        isVisited: false,
        isWall: false,
    };
};


const getNewGridWithWallToggle = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

const getNewGridStartChanged = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isStart: !node.isStart,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

{/*<li className="dropdown open">*/
}
{/*    <a className="dropdown-toggle" href="#" data-toggle="dropdown" aria-expanded="true">*/
}
{/*        "Algorithms"*/
}
{/*        <span className="caret"/>*/
}
{/*    </a>*/
}
{/*    <ul className="dropdown-menu">*/
}
{/*        <li id="Dijkstra">*/
}
{/*            <a href="#">Dijkstra's Algorithm</a>*/
}
{/*        </li>*/
}
{/*        <li id="aStar">*/
}
{/*            <a href="#">A* Search</a>*/
}
{/*        </li>*/
}
{/*    </ul>*/
}
{/*</li>*/
}