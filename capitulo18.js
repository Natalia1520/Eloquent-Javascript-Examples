/////////CONTENT NEGOTIATION
const url = "https://eloquentjavascript.net/author";
function getAuthor(format) {
  fetch(url, {
    headers: {
      Accept: format,
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("HTTP error " + response.status);
      return format === "application/json" ? response.json() : response.text();
    })
    .then((data) => {
      console.log(`Formato ${format}:`);
      console.log(data);
    })
    .catch((error) => console.error("Error:", error));
}
getAuthor("text/plain");
getAuthor("text/html");
getAuthor("application/json");

/////////A JAVASCRIPT WORKBENCH
document.querySelector("#run").addEventListener("click", () => {
  const code = document.querySelector("#code").value;
  const output = document.querySelector("#output");

  try {
    const result = eval(code);
    output.textContent = "Resultado: " + result;
  } catch (e) {
    output.textContent = "Error: " + e.message;
  }
});

/////////CONWAY'S GAME OF LIFE
const rows = 15,
  cols = 30;
let grid = createGrid();

function createGrid() {
  let arr = [];
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < cols; c++) {
      row.push(Math.random() < 0.3);
    }
    arr.push(row);
  }
  return arr;
}

function drawGrid() {
  const table = document.querySelector("#grid");
  table.innerHTML = "";
  for (let r = 0; r < rows; r++) {
    const rowEl = document.createElement("tr");
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement("td");
      cell.style.width = "15px";
      cell.style.height = "15px";
      cell.style.background = grid[r][c] ? "black" : "white";
      rowEl.appendChild(cell);
    }
    table.appendChild(rowEl);
  }
}

function nextGeneration() {
  const next = [];
  for (let r = 0; r < rows; r++) {
    next[r] = [];
    for (let c = 0; c < cols; c++) {
      const neighbors = countNeighbors(r, c);
      const alive = grid[r][c];
      next[r][c] = neighbors === 3 || (alive && neighbors === 2);
    }
  }
  grid = next;
  drawGrid();
}

function countNeighbors(row, col) {
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const r = row + dr,
        c = col + dc;
      if (r >= 0 && r < rows && c >= 0 && c < cols && grid[r][c]) {
        count++;
      }
    }
  }
  return count;
}

document.querySelector("#step").addEventListener("click", nextGeneration);

drawGrid();
