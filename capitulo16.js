/////////GAME OVER
let lives = 3;
const livesDisplay = document.createElement("div");
livesDisplay.style.position = "fixed";
livesDisplay.style.top = "10px";
livesDisplay.style.left = "10px";
livesDisplay.style.font = "bold 20px sans-serif";
livesDisplay.style.color = "white";
document.body.appendChild(livesDisplay);

function updateLivesDisplay() {
  livesDisplay.textContent = `Vidas: ${lives}`;
}
updateLivesDisplay();

function runGameWithLives(levels) {
  let current = 0;

  function startLevel() {
    runLevel(levels[current], DOMDisplay, (status) => {
      if (status === "lost") {
        lives--;
        updateLivesDisplay();
        if (lives > 0) {
          startLevel();
        } else {
          showGameOver();
        }
      } else if (status === "won") {
        current++;
        if (current < levels.length) {
          startLevel();
        } else {
          alert("¡Felicidades!");
        }
      }
    });
  }

  startLevel();
}

/////////PAUSING THE GAME
let paused = false;
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    paused = !paused;
    if (!paused) {
      requestAnimationFrame(frame);
    }
  }
});
let lastTime = null;

function frame(time) {
  if (paused) {
    lastTime = null;
    return;
  }

  if (lastTime != null) {
    state = state.update(time - lastTime, arrowKeys);
    display.syncState(state);
    if (state.status != null) {
      display.clear();
      resolve(state.status);
      return;
    }
  }

  lastTime = time;
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/////////A MONSTER
class Monster {
  constructor(pos) {
    this.pos = pos;
    this.size = new Vec(1, 1);
    this.speed = new Vec(0, 0);
    this.alive = true;
  }

  get type() {
    return "monster";
  }

  update(time, state) {
    if (!this.alive) return this;

    const player = state.player;
    const sameY = Math.abs(this.pos.y - player.pos.y) < 0.5;

    if (sameY) {
      const direction = player.pos.x > this.pos.x ? 1 : -1;
      this.speed = new Vec(direction * 2, 0);
    } else {
      this.speed = new Vec(0, 0);
    }

    const newPos = this.pos.plus(this.speed.times(time));
    if (!touchesWall(state, newPos, this.size)) {
      return new Monster(newPos);
    }
    return new Monster(this.pos);
  }

  collide(state) {
    const player = state.player;

    const isJumpingOn =
      player.speed.y > 0 && player.pos.y + player.size.y <= this.pos.y + 0.2;

    if (isJumpingOn) {
      const newActors = state.actors.filter((a) => a != this);
      return new State(state.level, newActors, state.status);
    }

    return new State(state.level, state.actors, "lost");
  }
}
const levelChars = {
  ".": "empty",
  "#": "wall",
  "+": "lava",
  "@": Player,
  o: Coin,
  "=": Lava,
  "|": Lava,
  v: Lava,
  M: Monster,
};

function touchesWall(state, pos, size) {
  let xStart = Math.floor(pos.x);
  let xEnd = Math.ceil(pos.x + size.x);
  let yStart = Math.floor(pos.y);
  let yEnd = Math.ceil(pos.y + size.y);

  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      let fieldType = state.level.touches(new Vec(x, y), new Vec(1, 1));
      if (fieldType === "wall") return true;
    }
  }
  return false;
}
