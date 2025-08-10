/////////DISK PERSISTENCE
import { createServer } from "http";
import { readFile, writeFile } from "fs/promises";

const DATA_FILE = "./data.json";
let talks = Object.create(null);

async function loadData() {
  try {
    let text = await readFile(DATA_FILE, "utf8");
    talks = JSON.parse(text);
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error("Error cargando datos:", err);
    }
  }
}

async function saveData() {
  try {
    await writeFile(DATA_FILE, JSON.stringify(talks, null, 2));
  } catch (err) {
    console.error("Error guardando datos:", err);
  }
}

createServer((req, res) => {
  if (req.method === "GET" && req.url === "/talks") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(talks));
  } else {
    res.writeHead(404);
    res.end();
  }
}).listen(8000, async () => {
  await loadData();
  console.log("Servidor iniciado en http://localhost:8000");
  setInterval(saveData, 60000);
});

/////////COMMENT FIELD RESETS
function setupCommentForm(talkTitle) {
  let form = document.querySelector(`#comment-form-${talkTitle}`);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    let commentField = form.querySelector("input[name=comment]");
    let authorField = form.querySelector("input[name=author]");

    let body = JSON.stringify({
      author: authorField.value,
      message: commentField.value,
    });

    let response = await fetch(
      `/talks/${encodeURIComponent(talkTitle)}/comments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      }
    );

    if (response.ok) {
      form.reset();
      commentField.focus();
    } else {
      console.error("Error al enviar comentario");
    }
  });
}
