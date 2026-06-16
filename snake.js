let player1Position = 1;
let player2Position = 1;
let currentPlayer = 1;
let gameOver = false;

let board = document.getElementById("board");
let rollBtn = document.getElementById("roll-btn");
let restartBtn = document.getElementById("restart-btn");

let turnText = document.getElementById("turn");
let diceText = document.getElementById("dice");
let diceBox = document.getElementById("dice-box");
let messageText = document.getElementById("message");
let p1PosText = document.getElementById("p1-pos");
let p2PosText = document.getElementById("p2-pos");

let snakes = {
  17: 7,
  34: 12,
  54: 30,
  62: 19,
  87: 24,
  98: 79
};

let ladders = {
  3: 22,
  8: 26,
  20: 41,
  36: 57,
  51: 72,
  71: 91
};

function makeBoard() {
  board.innerHTML = "";

  for (let row = 9; row >= 0; row--) {
    let numbers = [];

    for (let col = 1; col <= 10; col++) {
      numbers.push(row * 10 + col);
    }

    if (row % 2 !== 0) {
      numbers.reverse();
    }

    for (let i = 0; i < numbers.length; i++) {
      let number = numbers[i];

      let cell = document.createElement("div");
      cell.className = "cell";
      cell.setAttribute("data-number", number);

      let numberBox = document.createElement("div");
      numberBox.className = "number";
      numberBox.innerText = number;

      let note = document.createElement("div");
      note.className = "note";

      if (snakes[number]) {
        cell.classList.add("snake");
        note.innerText = "Snake to " + snakes[number];
      }

      if (ladders[number]) {
        cell.classList.add("ladder");
        note.innerText = "Ladder to " + ladders[number];
      }

      let tokenBox = document.createElement("div");
      tokenBox.className = "tokens";

      cell.appendChild(numberBox);
      cell.appendChild(note);
      cell.appendChild(tokenBox);

      board.appendChild(cell);
    }
  }

  showPlayers();
}

function showPlayers() {
  let allTokenBoxes = document.querySelectorAll(".tokens");

  allTokenBoxes.forEach(function(box) {
    box.innerHTML = "";
  });

  addToken(player1Position, "1", "player1");
  addToken(player2Position, "2", "player2");

  p1PosText.innerText = player1Position;
  p2PosText.innerText = player2Position;
}

function addToken(position, text, className) {
  let cell = document.querySelector('[data-number="' + position + '"]');
  let tokenBox = cell.querySelector(".tokens");

  let token = document.createElement("div");
  token.className = "token " + className;
  token.innerText = text;

  tokenBox.appendChild(token);
}

function rollDice() {
  if (gameOver) {
    return;
  }

  rollBtn.disabled = true;
  diceBox.classList.add("roll-animation");
  diceBox.innerText = "?";

  setTimeout(function() {
    let dice = Math.floor(Math.random() * 6) + 1;

    diceBox.innerText = dice;
    diceText.innerText = "Dice: " + dice;
    diceBox.classList.remove("roll-animation");

    if (currentPlayer === 1) {
      movePlayer(1, dice);
    } else {
      movePlayer(2, dice);
    }

    if (!gameOver) {
      rollBtn.disabled = false;
    }
  }, 450);
}

function movePlayer(player, dice) {
  let position;

  if (player === 1) {
    position = player1Position;
  } else {
    position = player2Position;
  }

  let newPosition = position + dice;

  if (newPosition > 100) {
    messageText.innerText = "Player " + player + " needs exact number to win.";
    changeTurn();
    return;
  }

  if (snakes[newPosition]) {
    messageText.innerText = "Player " + player + " got snake.";
    newPosition = snakes[newPosition];
  } else if (ladders[newPosition]) {
    messageText.innerText = "Player " + player + " climbed ladder.";
    newPosition = ladders[newPosition];
  } else {
    messageText.innerText = "Player " + player + " moved to " + newPosition;
  }

  if (player === 1) {
    player1Position = newPosition;
  } else {
    player2Position = newPosition;
  }

  showPlayers();

  if (newPosition === 100) {
    messageText.innerText = "Player " + player + " won the game.";
    turnText.innerText = "Game Over";
    gameOver = true;
    return;
  }

  changeTurn();
}

function changeTurn() {
  if (currentPlayer === 1) {
    currentPlayer = 2;
    turnText.innerText = "Player 2 Turn";
  } else {
    currentPlayer = 1;
    turnText.innerText = "Player 1 Turn";
  }
}

function restartGame() {
  player1Position = 1;
  player2Position = 1;
  currentPlayer = 1;
  gameOver = false;

  turnText.innerText = "Player 1 Turn";
  diceText.innerText = "Dice: -";
  diceBox.innerText = "-";
  messageText.innerText = "Click roll dice to start.";
  rollBtn.disabled = false;

  showPlayers();
}

rollBtn.addEventListener("click", rollDice);
restartBtn.addEventListener("click", restartGame);

makeBoard();
