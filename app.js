(function startGame() {
  document.querySelector('#start').addEventListener('click', (e) => {
    e.currentTarget.style.display = 'none';
    playGame();
  });
})();

function Player(token, turn) {
  this.token = token;
  this.turn = turn;
}

function playGame() {
  const player1 = new Player('x', true);
  const player2 = new Player('o', false);
  const game = initGame();
  const display = displayGame();
  const result = displayResult();

  function checkResult(token) {
    let msg = '';

    if (game.isWinner(token)) msg = `${token.toUpperCase()} WINS!`;
    else if (game.isDraw()) msg = 'DRAW!';
    return msg;
  }

  function endTurn() {
    player1.turn = !player1.turn;
    player2.turn = !player2.turn;
    display.tokenHoverEffect(player1);
    display.tokenHoverEffect(player2);
  }

  function startTurn() {
    player1.turn = true;
    player2.turn = false;
    display.tokenHoverEffect(player1);
    display.tokenHoverEffect(player2);
    display.addClickToSquares(placeToken);
  }

  function resetGame() {
    game.resetBoard();
    display.toggleBlurScreen();

    startTurn();
    display.updateGameBoard(game.getBoard(), player1, player2);
  }

  function placeToken(e) {
    const index = Number(e.target.getAttribute('data-sqr'));

    if (!game.isValidMove(index)) return;

    const token = player1.turn ? player1.token : player2.token;
    game.setToken(index, token);

    const gameResult = checkResult(token);
    if (gameResult !== '') {
      result.showResult(gameResult, token === player2.token);
      display.removeClickToSquares(placeToken);
      display.tokenHoverEffect({ token: player1.token, turn: false });
      display.tokenHoverEffect({ token: player2.token, turn: false });
      display.toggleBlurScreen();
    } else endTurn();
    display.updateGameBoard(game.getBoard(), player1, player2);
  }

  display.addClickToSquares(placeToken);
  result.addEventReset(resetGame);
  startTurn();
}

function initGame() {
  const _board = new Array(9).fill('');
  const _winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const getBoard = () => _board;
  const isValidMove = (index) => _board[index] === '';
  const setToken = (index, token) => (_board[index] = token);
  const getWinCombos = () => _winCombos;
  const resetBoard = () => _board.fill('');
  const isWinner = (token) =>
    _winCombos.some((value) => value.every((index) => _board[index] === token));
  const isDraw = () => _board.every((item) => item !== '');

  return {
    getBoard,
    isValidMove,
    setToken,
    getWinCombos,
    resetBoard,
    isWinner,
    isDraw,
  };
}

function displayGame() {
  const gameBoard = document.querySelector('#board');
  const gameHeading = document.querySelector('#heading');
  const gameSquares = document.querySelectorAll('[data-sqr]');

  function updateGameBoard(source, player1, player2) {
    gameSquares.forEach((item, index) => {
      if (source[index] !== '') item.classList.add(source[index]);
      else item.classList.remove(player1.token, player2.token);
    });
  }

  function tokenHoverEffect(player) {
    gameBoard.classList.toggle(player.token, player.turn);
  }

  function toggleBlurScreen() {
    gameBoard.classList.toggle('blur');
    gameHeading.classList.toggle('blur');
  }

  function addClickToSquares(placeToken) {
    [...gameSquares].forEach((item) =>
      item.addEventListener('click', placeToken, { once: true })
    );
  }

  function removeClickToSquares(placeToken) {
    [...gameSquares].forEach((item) =>
      item.removeEventListener('click', placeToken)
    );
  }
  return {
    updateGameBoard,
    toggleBlurScreen,
    tokenHoverEffect,
    addClickToSquares,
    removeClickToSquares,
  };
}

function displayResult() {
  const resultScreen = document.querySelector('#result-info');
  const resultGame = document.querySelector('#result');

  function showResult(resultValue, addSecondaryColor) {
    resultGame.classList.toggle('color-secondary', addSecondaryColor);
    resultGame.textContent = resultValue;
    resultScreen.style.display = 'flex';
  }

  function hideResult(resetGame) {
    resultScreen.style.display = 'none';
    resetGame();
  }

  function addEventReset(resetGame) {
    resultScreen.addEventListener('click', function () {
      hideResult(resetGame);
    });
  }
  return { showResult, addEventReset };
}
