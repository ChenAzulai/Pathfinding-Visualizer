import React, {Component} from 'react';
import './Node.css'


export default class Node extends Component {
    render() {
        const {
            col,
            row,
            isStart,
            isFinish,
            isVisited,
            isWall,
            onMouseUp,
            onMouseDown,
            onMouseEnter,
        } = this.props;
        const extraClassName =
            isFinish ? 'node-finish'
                : isStart ? 'node-start'
                : isWall ? 'node-wall'
                    : '';
        return (
            <div
                id={`node-${row}-${col}`}
                className={`node ${extraClassName}`}
                onMouseUp={() => onMouseUp(row,col)}
                onMouseDown={() => onMouseDown(row, col)}
                onMouseEnter={() => onMouseEnter(row, col)}/>
        );
    }
}
