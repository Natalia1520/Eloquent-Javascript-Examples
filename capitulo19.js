/////////KEYBOARD BINDINGS
window.addEventListener("keydown", (event) => {
  if (event.ctrlKey || event.metaKey) return;

  const tool = document.querySelector("select[name=tool]");
  const color = document.querySelector("input[name=color]");

  switch (event.key.toLowerCase()) {
    case "p":
      tool.value = "draw";
      break;
    case "l":
      tool.value = "line";
      break;
    case "c":
      color.value = "#00ffff";
      break;
    case "r":
      color.value = "#ff0000";
      break;
    case "z":
      if (typeof undo === "function") undo();
      break;
    default:
      return;
  }

  event.preventDefault();
});

/////////EFFICIENT DRAWING
function drawPixel(position, state, dispatch) {
  let { x, y } = position;
  if (x < 0 || x >= state.picture.width || y < 0 || y >= state.picture.height) {
    return state;
  }

  let drawn = Object.create(null);
  drawn[`${x},${y}`] = true;

  return startDragging((position) => {
    let newCoords = `${position.x},${position.y}`;
    if (drawn[newCoords]) return null;

    drawn[newCoords] = true;

    return {
      picture: state.picture.draw([
        { x: position.x, y: position.y, color: state.color },
      ]),
    };
  });
}

/////////CIRCLES
tools.circle = function (center, state, dispatch) {
  return startDragging((end) => {
    let radius = Math.sqrt(
      Math.pow(end.x - center.x, 2) + Math.pow(end.y - center.y, 2)
    );

    let pixels = [];
    for (let y = 0; y < state.picture.height; y++) {
      for (let x = 0; x < state.picture.width; x++) {
        let dx = x - center.x;
        let dy = y - center.y;
        if (Math.sqrt(dx * dx + dy * dy) <= radius) {
          pixels.push({ x, y, color: state.color });
        }
      }
    }

    dispatch({ picture: state.picture.draw(pixels) });
  });
};

/////////PROPER LINES
tools.properLine = function (start, state, dispatch) {
  return startDragging((end) => {
    let points = [];

    let dx = Math.abs(end.x - start.x);
    let dy = Math.abs(end.y - start.y);

    let sx = start.x < end.x ? 1 : -1;
    let sy = start.y < end.y ? 1 : -1;

    let err = dx - dy;

    let x = start.x;
    let y = start.y;

    while (true) {
      points.push({ x, y, color: state.color });
      if (x === end.x && y === end.y) break;
      let e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }

    dispatch({ picture: state.picture.draw(points) });
  });
};
