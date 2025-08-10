/////////SEARCH TOOL
const fs = require("fs").promises;
const path = require("path");
async function searchInDirectory(dir, pattern) {
  try {
    const files = await fs.readdir(dir, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(dir, file.name);

      if (file.isDirectory()) {
        await searchInDirectory(fullPath, pattern);
      } else {
        const content = await fs.readFile(fullPath, "utf8");
        const lines = content.split("\n");

        lines.forEach((line, index) => {
          if (line.toLowerCase().includes(pattern.toLowerCase())) {
            console.log(`${fullPath} (línea ${index + 1}): ${line.trim()}`);
          }
        });
      }
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}
const [, , dir, pattern] = process.argv;

if (!dir || !pattern) {
  console.log("Uso: node search.js <directorio> <palabra>");
} else {
  searchInDirectory(dir, pattern);
}

/////////DIRECTORY CREATION
const fs = require("fs").promises;
const path = require("path");
async function createDirectories(paths) {
  const tasks = paths.map(async (dirPath) => {
    try {
      const fullPath = path.resolve(dirPath);
      await fs.mkdir(fullPath, { recursive: true });
      console.log(`Directorio creado: ${fullPath}`);
    } catch (err) {
      console.error(`Error creando ${dirPath}:`, err.message);
    }
  });
  await Promise.all(tasks);
}

const [, , ...dirs] = process.argv;

if (dirs.length === 0) {
  console.log("Uso: node createDirs.js <ruta1> <ruta2> ...");
} else {
  createDirectories(dirs);
}

/////////A PUBLIC SPACE ON THE WEB
const http = require("http");
const fs = require("fs").promises;
const path = require("path");

const baseDir = path.resolve("public");

async function ensureBaseDir() {
  await fs.mkdir(baseDir, { recursive: true });
}
ensureBaseDir();

function getFilePath(url) {
  return path.join(baseDir, decodeURIComponent(url));
}

const server = http.createServer(async (req, res) => {
  try {
    const filePath = getFilePath(req.url);

    if (req.method === "GET") {
      if (req.url === "/") {
        const files = await fs.readdir(baseDir);
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(files.join("\n"));
      } else {
        const data = await fs.readFile(filePath);
        res.writeHead(200);
        res.end(data);
      }
    } else if (req.method === "PUT") {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      await fs.writeFile(filePath, Buffer.concat(chunks));
      res.writeHead(201);
      res.end("Archivo guardado\n");
    } else if (req.method === "DELETE") {
      await fs.unlink(filePath);
      res.writeHead(200);
      res.end("Archivo eliminado\n");
    } else {
      res.writeHead(405);
      res.end("Método no permitido\n");
    }
  } catch (err) {
    res.writeHead(500);
    res.end(`Error: ${err.message}\n`);
  }
});

server.listen(8000, () => {
  console.log("Servidor en http://localhost:8000/");
});
