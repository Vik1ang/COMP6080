const HOOP_OFFSET_MAX_Y = 161;
const HOOP_OFFSET_MIN_Y = 148;
const HOOP_OFFSET_MAX_X = 227;
const HOOP_OFFSET_MIN_X = 73;

const ball = document.getElementById('ball');
const hoop = document.getElementById('hoop');
const scoreboard = document.getElementById('scoreboard');

let cursorInBallOffsetX = 0;
let cursorInBallOffsetY = 0;
let score = 0;
let hasScored = false;

const onMouseMove = (event) => {
  event.preventDefault();

  ball.style.left = event.clientX - cursorInBallOffsetX + 'px';
  ball.style.top = event.clientY - cursorInBallOffsetY + 'px';

  const hoopRect = hoop.getBoundingClientRect();

  if (event.clientX > hoopRect.left + HOOP_OFFSET_MIN_X
    && event.clientY < hoopRect.left + HOOP_OFFSET_MAX_X
    && event.clientY > hoopRect.top + HOOP_OFFSET_MIN_Y
    && event.clientY < hoopRect.top + HOOP_OFFSET_MAX_Y) {
    if (!hasScored) {
      score += 1;
      scoreboard.textContent = `Score: ${score}`;
    }

    hasScored = true;
  } else {
    hasScored = false;
  }
};

ball.addEventListener('mousedown', (event) => {
  document.addEventListener('mousemove', onMouseMove);
  
  const ballRect = ball.getBoundingClientRect();
  cursorInBallOffsetX = event.clientX - ballRect.left;
  cursorInBallOffsetY = event.clientY - ballRect.top;
});

ball.addEventListener('mouseup', () => {
  document.removeEventListener('mousemove', onMouseMove);
});
