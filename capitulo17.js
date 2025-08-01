/////////SHAPES
function drawShape(cx, sides, centerX, centerY, radius) {
  if (sides < 3) return;
  let angleStep = (2 * Math.PI) / sides;

  cx.beginPath();
  for (let i = 0; i < sides; i++) {
    let angle = i * angleStep;
    let x = centerX + Math.cos(angle) * radius;
    let y = centerY + Math.sin(angle) * radius;
    if (i === 0) {
      cx.moveTo(x, y);
    } else {
      cx.lineTo(x, y);
    }
  }
  cx.closePath();
  cx.strokeStyle = "black";
  cx.stroke();
}

let canvas = document.querySelector("canvas");
let cx = canvas.getContext("2d");

drawShape(cx, 5, 80, 80, 40);
drawShape(cx, 6, 180, 80, 40);
drawShape(cx, 3, 280, 80, 40);

/////////THE PIE CHART
function drawPieChart(cx, data, centerX, centerY, radius) {
  let total = data.reduce((sum, entry) => sum + entry.count, 0);
  let currentAngle = 0;

  for (let entry of data) {
    let sliceAngle = (entry.count / total) * 2 * Math.PI;

    cx.beginPath();
    cx.moveTo(centerX, centerY);
    cx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
    cx.closePath();
    cx.fillStyle = entry.color;
    cx.fill();

    let midAngle = currentAngle + sliceAngle / 2;
    let labelX = centerX + Math.cos(midAngle) * (radius + 20);
    let labelY = centerY + Math.sin(midAngle) * (radius + 20);
    cx.fillStyle = "black";
    cx.font = "14px sans-serif";
    cx.textAlign = "center";
    cx.fillText(entry.name, labelX, labelY);

    currentAngle += sliceAngle;
  }
}

let canvas = document.querySelector("canvas");
let cx = canvas.getContext("2d");

let results = [
  { name: "Satisfied", count: 1043, color: "lightgreen" },
  { name: "Neutral", count: 563, color: "lightblue" },
  { name: "Unsatisfied", count: 510, color: "pink" },
  { name: "No response", count: 175, color: "silver" },
];

drawPieChart(cx, results, 150, 100, 80);

/////////A BOUNCING BALL
let canvas = document.querySelector("canvas");
let cx = canvas.getContext("2d");

let ball = {
  x: 100,
  y: 100,
  radius: 15,
  speedX: 4,
  speedY: 3,
  color: "red",
};

function updateBall() {
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.speedX *= -1;
    ball.color = randomColor();
  }

  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.speedY *= -1;
    ball.color = randomColor();
  }
}

function drawBall() {
  cx.clearRect(0, 0, canvas.width, canvas.height);
  cx.beginPath();
  cx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
  cx.fillStyle = ball.color;
  cx.fill();
}

function randomColor() {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgb(${r},${g},${b})`;
}

function animate() {
  updateBall();
  drawBall();
  requestAnimationFrame(animate);
}

animate();

/////////PRECOMPUTED MIRRORING
let canvas = document.querySelector("canvas");
let cx = canvas.getContext("2d");

let image = new Image();
image.src = "https://eloquentjavascript.net/img/player.png";

image.onload = () => {
  let width = image.width;
  let height = image.height;

  cx.drawImage(image, 0, 0);

  cx.save();

  cx.translate(width * 2 + 10, 0);

  cx.scale(-1, 1);

  cx.drawImage(image, 0, 0);

  cx.restore();
};
