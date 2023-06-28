const humanPlayer = "O";
const aiPlayer = "X";
const winningPositions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const squares = Array.from(document.getElementsByClassName("square"));
const scoreXElement = document.getElementById("scoreX");
const scoreOElement = document.getElementById("scoreO");

let originalBoard;
let gameOver = false;
let scoreX = 0;
let scoreO = 0;

startGame();

function startGame() {
  originalBoard = Array.from(Array(9).keys());
  gameOver = false;
  squares.forEach(square => {
    square.innerText = "";
    square.classList.remove("square--X", "square--O", "winner");
    square.addEventListener("click", turnClick);
  });
}

function turnClick(event) {
  if (!gameOver) {
    const square = event.target;
    const squareId = parseInt(square.id);
    if (typeof originalBoard[squareId] === "number") {
      turn(squareId, humanPlayer);
      if (!gameOver && !checkTie()) {
        setTimeout(() => {
          turn(bestSpot(), aiPlayer);
        }, 200);
      }
    }
  }
}

function turn(squareId, player) {
  originalBoard[squareId] = player;
  const square = document.getElementById(squareId.toString());
  square.classList.add(`square--${player}`);

  let gameWon = checkWin(originalBoard, player);
  if (gameWon) {
    gameOver = true;
    highlightWinner(gameWon);
    updateScore(gameWon.player);
    setTimeout(() => {
      startGame();
    }, 900);
  } else if (checkTie()) {
    gameOver = true;
    setTimeout(() => {
      startGame();
    }, 900);
  }
}

function checkWin(board, player) {
  const plays = board.reduce((acc, element, index) => {
    if (element === player) {
      acc.push(index);
    }
    return acc;
  }, []);

  let gameWon = null;
  for (const [index, win] of winningPositions.entries()) {
    if (win.every(elem => plays.includes(elem))) {
      gameWon = { index, player };
      break;
    }
  }
  return gameWon;
}

function highlightWinner(gameWon) {
  const { index, player } = gameWon;
  for (const elem of winningPositions[index]) {
    document.getElementById(elem.toString()).classList.add("winner");
  }
  squares.forEach(square => {
    square.removeEventListener("click", turnClick);
  });
}

function updateScore(player) {
  if (player === "X") {
    scoreX++;
    scoreXElement.textContent = scoreX;
  } else if (player === "O") {
    scoreO++;
    scoreOElement.textContent = scoreO;
  }
}

function checkTie() {
  if (originalBoard.every(element => typeof element !== "number")) {
    squares.forEach(square => {
      square.removeEventListener("click", turnClick);
    });
    return true;
  }
  return false;
}

function bestSpot() {
  const emptySquares = getEmptySquares();
  const randomIndex = Math.floor(Math.random() * emptySquares.length);
  return emptySquares[randomIndex];
}

function getEmptySquares() {
  return originalBoard.filter(element => typeof element === "number");
}
