/////////BALLOON

<p id="balloon">🎈</p>;

const balloon = document.querySelector("#balloon");

let scale = 1;
const maxScale = 3;
const minScale = 0.5;
const step = 0.1;

function handleKey(event) {
  if (event.key === "ArrowUp") {
    scale += step;
    if (scale >= maxScale) {
      balloon.textContent = "💥";
      document.removeEventListener("keydown", handleKey);
      return;
    }
  } else if (event.key === "ArrowDown") {
    scale = Math.max(minScale, scale - step);
  } else {
    return;
  }

  balloon.style.transform = `scale(${scale})`;
}

document.addEventListener("keydown", handleKey);

/////////MOUSE TRAIL
document.addEventListener("mousemove", (event) => {
  const dot = document.createElement("div");
  dot.className = "trail-dot";

  // Punto
  dot.style.left = `${event.pageX}px`;
  dot.style.top = `${event.pageY}px`;

  document.body.appendChild(dot);

  // Se desvanece
  setTimeout(() => {
    dot.style.opacity = "0";
  }, 300);
  // Se elimina
  setTimeout(() => {
    dot.remove();
  }, 800);
});

/////////TABS
<div id="tab-container">
  <section title="Tab 1">Contenido de la pestaña 1</section>
  <section title="Tab 2">Contenido de la pestaña 2</section>
  <section title="Tab 3">Contenido de la pestaña 3</section>
</div>;

function setupTabs(container) {
  const sections = Array.from(container.querySelectorAll("section"));
  const tabBar = document.createElement("div");
  tabBar.className = "tabs";

  sections.forEach((section, index) => {
    const button = document.createElement("button");
    button.textContent = section.getAttribute("title") || `Tab ${index + 1}`;
    button.className = "tab-button";

    button.addEventListener("click", () => {
      sections.forEach((s) => s.classList.remove("active", "tab-content"));
      tabBar
        .querySelectorAll("button")
        .forEach((b) => b.classList.remove("active"));

      section.classList.add("active", "tab-content");
      button.classList.add("active");
    });

    tabBar.appendChild(button);
    section.classList.add("tab-content");
  });

  container.insertBefore(tabBar, container.firstChild);
  tabBar.firstChild.click(); // activar la primera pestaña
}

setupTabs(document.querySelector("#tab-container"));
