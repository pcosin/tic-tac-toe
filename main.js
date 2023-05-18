let originalBoard;
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

const $square = document.querySelectorAll(".square");

startGame();

function startGame() {
  originalBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  for (let i = 0; i < $square.length; i++) {
    $square[i].innerText = "";
    $square[i].addEventListener("click", turnClick, false);
  }
}

// Resto del código...

function turnClick(square) {
  if (typeof originalBoard[square.target.id] === "number") {
    turn(square.target.id, humanPlayer);
    setTimeout(() => {
      if (!checkTie()) turn(bestSpot(), aiPlayer);
    }, 400);
  }
}

function turn(squareId, player) {
  console.log(player);
  originalBoard[squareId] = player;
  if (player === "O") {
    console.log(squareId);
    document.getElementById(squareId).classList.add("square--O");
  } else {
    console.log(squareId);
    document.getElementById(squareId).classList.add("square--X");
  }
  let gameWon = checkWin(originalBoard, player);
  if (gameWon) {
    gameOver(gameWon);
  }
}

function checkWin(board, player) {
  let plays = board.reduce(
    (acc, element, index) => (element === player ? acc.concat(index) : acc),
    []
  );
  let gameWon = null;
  for (let [index, win] of winningPositions.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winningPositions[gameWon.index]) {
    const element = document.getElementById(index);

    element.classList.remove("square--X", "square--O", "winner");

    if (gameWon.player === humanPlayer) {
      element.classList.add("square--O", "winner");
    } else {
      element.classList.add("square--X", "winner");
    }
  }
  for (let i = 0; i < $square.length; i++) {
    $square[i].removeEventListener("click", turnClick, false);
  }

  // declareWinner(gameWon.player == humanPlayer ? "You win!" : "You lose.");
}

function bestSpot() {
  const emptySquares = getEmptySquares();
  const randomIndex = Math.floor(Math.random() * emptySquares.length);
  return emptySquares[randomIndex];
}

function getEmptySquares() {
  return Array.from(document.getElementsByClassName("square"))
    .filter(
      (square) => !square.classList.contains("square--X") && !square.classList.contains("square--O")
    )
    .map((square) => parseInt(square.id));
}

// function declareWinner(string) {
//   alert(string);
// }

function checkTie() {
  if (getEmptySquares().length == 0) {
    for (var i = 0; i < $square.length; i++) {
      $square[i].style.backgroundColor = "green";
      $square[i].removeEventListener("click", turnClick, false);
    }
    // declareWinner("Tie Game!");
    return true;
  }
  return false;
}
