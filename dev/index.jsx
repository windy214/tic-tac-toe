import React from 'react';
import ReactDOM from 'react-dom';

// stateless functional components (only consist of a render method)
function Square(props) {
  return (
    <button style={{ color: props.isRed ? 'red' : '' }} className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let isRed = false;
    for (let num of this.props.winline) {
      if (isRed = num === i) {
        break;
      }
    }
    return <Square isRed={isRed} key={i} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }
  render() {
    const board = Array(3).fill(null);
    const items = Array(3).fill(null);

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        items[j] = this.renderSquare(i * 3 + j);
      }
      board.push(<div className="board-row" key={i} >{items.slice()}</div>)
    }
    return (
      <div>
        {board}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      winline: Array(3).fill(null),
      xIsNext: true,
      stepNumber: 0,
      reverseRank: false
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });

    this.checkWinline(squares);
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });
    this.checkWinline(this.state.history[step].squares);
  }

  reverseRank() {
    this.setState({
      reverseRank: !this.state.reverseRank,
    })
  }

  checkWinline(squares) {
    const result = calculateWinner(squares);
    result ? this.setState({ winline: result.winline }) : this.state.winline[0] === null ? undefined : this.setState({
      winline: Array(3).fill(null)
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const result = calculateWinner(current.squares);

    let status;
    if (result) {
      status = 'Winner: ' + result.winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    const moves = history.map((step, move) => {
      const desc = move ?
        `Move (${Boolean(move % 2) ? 'X' : 'O'},${Math.ceil(move / 2)})` :
        'Game start';
      let isbold = this.state.stepNumber == move ? 'bold' : '';
      return (
        <li key={move}>
          <a href="#" style={{ fontWeight: isbold }} onClick={() => { this.jumpTo(move); }}>{desc}</a>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board winline={this.state.winline} squares={current.squares} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.reverseRank()}>切换顺序</button>
          <ol>{this.state.reverseRank ? moves.reverse() : moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('container')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winline: [a, b, c]
      };
    }
  }
  return null;
}
