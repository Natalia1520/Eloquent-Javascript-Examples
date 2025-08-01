/////////BUILD A TABLE
function construirTabla(datos) {
  const tabla = document.createElement("table");
  tabla.style.borderCollapse = "collapse";
  tabla.style.margin = "1em 0";
  tabla.style.fontFamily = "sans-serif";

  const encabezados = Object.keys(datos[0]);

  const encabezado = document.createElement("tr");
  for (const clave of encabezados) {
    const th = document.createElement("th");
    th.textContent = clave[0].toUpperCase() + clave.slice(1);
    th.style.border = "1px solid #ccc";
    th.style.padding = "6px 12px";
    th.style.backgroundColor = "#eee";
    encabezado.appendChild(th);
  }
  tabla.appendChild(encabezado);

  for (const fila of datos) {
    const tr = encabezados.reduce((filaHTML, clave) => {
      const td = document.createElement("td");
      const valor = fila[clave];
      td.textContent = valor;

      td.style.border = "1px solid #ccc";
      td.style.padding = "6px 12px";

      if (typeof valor === "number") {
        td.style.textAlign = "right";
      }

      filaHTML.appendChild(td);
      return filaHTML;
    }, document.createElement("tr"));

    tabla.appendChild(tr);
  }

  return tabla;
}

document.body.appendChild(construirTabla(MOUNTAINS));

/////////ELEMENTS BY TAG NAME
function byTagName(node, tagName) {
  const resultado = [];

  const nata = document.createTreeWalker(
    node,
    NodeFilter.SHOW_ELEMENT,
    null,
    false
  );

  while (nata.nextNode()) {
    const actual = nata.currentNode;
    if (actual.nodeName.toLowerCase() === tagName.toLowerCase()) {
      resultado.push(actual);
    }
  }

  return resultado;
}
console.log(byTagName(document.body, "h1"));
console.log(byTagName(document.body, "p"));
console.log(byTagName(document, "section"));

/////////THE CAT'S HAT
let cat = document.querySelector("#cat");
let hat = document.querySelector("#hat");

let angle = 0;
let lastTime = null;

function animate(time) {
  if (lastTime != null) angle += (time - lastTime) * 0.001;
  lastTime = time;
  cat.style.top = Math.sin(angle) * 40 + 40 + "px";
  cat.style.left = Math.cos(angle) * 200 + 230 + "px";

  const bounce = Math.abs(Math.sin(angle * 2)) * 20;
  const hatX = catX + 10;
  const hatY = catY - 30 - bounce;

  hat.style.left = hatX + "px";
  hat.style.top = hatY + "px";

  hat.style.transform = `rotate(${angle * 4}rad)`;

  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
