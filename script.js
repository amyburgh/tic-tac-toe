const play = document.querySelector('#play');
const heading = document.querySelector('#heading');
const board = document.querySelector('#board');
const allSquares = document.querySelectorAll('[data-sqr]');
const restart = document.querySelector('#result-info');
const result = restart.querySelector('#result');

const WIN = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const token = { a: 'x', b: 'o' };
let turn = token.a;

play.addEventListener('click', startGame, { once: true });
restart.addEventListener('click', restartGame);

function startGame(e) {
  initGame();
  e.currentTarget.style.display = 'none';
}

function initGame() {
  allSquares.forEach((sqr) =>
    sqr.addEventListener('click', placeToken, { once: true })
  );
  board.classList.add(turn);
}

function restartGame(e) {
  allSquares.forEach((sqr) => {
    sqr.classList.remove(token.a, token.b);
    sqr.removeEventListener('click', placeToken);
  });
  initGame();
  e.currentTarget.style.display = 'none';
  toggleBlurBackground();
}

function placeToken(e) {
  e.target.classList.add(turn);

  if (getWinner(turn) === true) {
    showWinner(turn);
  } else if (isDraw() === true) {
    showDraw();
  } else setBoardHover();
  turn = turn == token.a ? token.b : token.a;
}

function setBoardHover() {
  board.classList.toggle(token.a);
  board.classList.toggle(token.b);
}

function isDraw() {
  return [...allSquares].every(
    (sqr) => sqr.classList.contains(token.a) || sqr.classList.contains(token.b)
  );
}

function showDraw() {
  result.classList.remove('color-secondary');
  result.textContent = 'DRAW!';
  restart.style.display = 'flex';
  board.classList.remove(token.a, token.b);
  toggleBlurBackground();
}

function getWinner(turn) {
  return WIN.some((value) =>
    value.every((index) => allSquares[index].classList.contains(turn))
  );
}

function showWinner(turn) {
  const winner = turn.toUpperCase();

  if (turn === token.b) {
    result.classList.add('color-secondary');
  } else {
    result.classList.remove('color-secondary');
  }
  result.textContent = `${winner} WINS!`;
  restart.style.display = 'flex';
  board.classList.remove(token.a, token.b);
  toggleBlurBackground();
}

function toggleBlurBackground() {
  board.classList.toggle('blur');
  heading.classList.toggle('blur');
}
