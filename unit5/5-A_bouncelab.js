const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const info = document.getElementById("info");

let x = 100;
let y = 80;
let vx = 180;
let vy = 140;
let r = 14;
let color = "#ffd166";

const colors = [
  "#ff595e",
  "#ffca3a",
  "#8ac926",
  "#1982c4",
  "#6a4c93",
  "#ffffff"
];

let last = performance.now();

document.addEventListener("keydown", (e) => {

  if (e.code === "ArrowUp") {
    vx *= 1.2;
    vy *= 1.2;
  }

  if (e.code === "ArrowDown") {
    vx *= 0.8;
    vy *= 0.8;
  }

  if (e.code === "ArrowRight") {
    r += 5;
  }

  if (e.code === "ArrowLeft") {
    r -= 5;

    if (r < 5) {
      r = 5;
    }
  }

  if (e.code === "KeyC") {
    color = "red";
  }
});

function changeColor() {
  color = colors[Math.floor(Math.random() * colors.length)];
}

function update(dt) {
  x = x + vx * dt;
  y = y + vy * dt;

  // 左右の壁
  if (x + r > canvas.width) {
    x = canvas.width - r;
    vx = -vx;
    changeColor();
  }

  if (x - r < 0) {
    x = r;
    vx = -vx;
    changeColor();
  }

  // 上下の壁
  if (y + r > canvas.height) {
    y = canvas.height - r;
    vy = -vy;
    changeColor();
  }

  if (y - r < 0) {
    y = r;
    vy = -vy;
    changeColor();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function loop(now) {
  const dt = (now - last) / 1000;
  last = now;

  info.textContent =
    "dt：" + dt.toFixed(4) +
    " 秒 ／ 1秒に約 " +
    (1 / dt).toFixed(0) +
    " 回";

  update(dt);
  draw();

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);