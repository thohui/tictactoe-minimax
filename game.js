let board = Array(9).fill("");
const PLAYER = "O";
const AI = "X";
let isFinished = false;

function getAvailableMoves() {
  let moves = [];
  board.forEach((value, index) => {
    if (!value) {
      moves.push(index);
    }
  });
  return moves;
}

function getGameState() {
  const conditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const condition of conditions) {
    if (
      board[condition[0]] === board[condition[1]] &&
      board[condition[1]] === board[condition[2]] &&
      !!board[condition[0]]
    ) {
      return { over: true, tie: false, winner: board[condition[1]] };
    }
  }
  if (getAvailableMoves().length === 0) {
    return { over: true, tie: true, winner: null };
  }
  return { over: false, tie: false, winner: null };
}

function makeMove(index, player) {
  board[index] = player;
  let cell = document.getElementsByClassName("cell")[index];
  cell.textContent = player;
}

function clearBoard() {
  board = Array(9).fill("");
  for (cell of document.getElementsByClassName("cell")) {
    cell.textContent = "";
  }
}

function makePlayerMove(index) {
  const moves = getAvailableMoves();
  if (moves.includes(index) && !isFinished) {
    makeMove(index, PLAYER);
    const state = getGameState();
    if (state.over) {
      isFinished = true;
      return alert(state.tie ? "tie" : "you won!");
    }
    makeAIMove();
  } else if (isFinished) {
    isFinished = false;
    clearBoard();
    makePlayerMove(index);
  }
}
function makeAIMove() {
  const moves = getAvailableMoves();
  let best = -Infinity;
  let move = null;
  for (const currMove of moves) {
    board[currMove] = AI;
    let score = minimax(false);
    board[currMove] = "";
    if (score > best) {
      best = score;
      move = currMove;
    }
  }
  makeMove(move, AI);
  const state = getGameState();
  if (state.winner) {
    alert("AI won");
  } else if (state.tie) {
    alert("tie");
  }
  isFinished = state.over;
}

function minimax(isMaximizing) {
  let state = getGameState();
  if (state.winner) {
    return state.winner === AI ? 1 : -1;
  }
  if (state.tie) {
    return 0;
  }
  if (isMaximizing) {
    let best = -Infinity;
    const moves = getAvailableMoves();
    for (const move of moves) {
      board[move] = AI;
      let score = minimax(false);
      board[move] = null;
      if (score > best) {
        best = score;
      }
    }
    return best;
  }
  let best = Infinity;
  const moves = getAvailableMoves();
  for (const move of moves) {
    board[move] = PLAYER;
    let score = minimax(true);
    board[move] = "";
    if (score < best) {
      best = score;
    }
  }
  return best;
}
