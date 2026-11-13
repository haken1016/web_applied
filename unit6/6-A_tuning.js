
const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

// 調整する数（ここだけを変えて試す）
const CONFIG = {
  GRAVITY: 2000,
  JUMP_SPEED: 700,
  MOVE_SPEED: 240,
  MAX_JUMPS: 2,
  FALL_GRAVITY_RATE: 2,
  HIP_DROP_GRAVITY_RATE: 10, // ヒップドロップ時の重力倍率
};

const TARGET_HEIGHT = 64;

const player = {
  x: 80,
  y: 20,
  w: 32,
  h: 32,
  vy: 0,
  isGrounded: false,
  jumpsLeft: CONFIG.MAX_JUMPS
};

const floor = { x: 0, y: 320, w: 640, h: 40 };

const keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.code] = true;

  // 跳べる回数が残っていれば跳ぶ（空中でも）
  if (e.code === "Space" && player.jumpsLeft > 0) {
    player.vy = -CONFIG.JUMP_SPEED;
    player.jumpsLeft = player.jumpsLeft - 1;
  }
});

document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

function collideWithFloor() {
  if (player.y + player.h > floor.y) {
    player.y = floor.y - player.h;
    player.vy = 0;
    player.isGrounded = true;
    player.jumpsLeft = CONFIG.MAX_JUMPS;
  } else {
    player.isGrounded = false;
  }
}

function update(dt) {
  if (keys["ArrowRight"]) {
    player.x = player.x + CONFIG.MOVE_SPEED * dt;
  }
  if (keys["ArrowLeft"]) {
    player.x = player.x - CONFIG.MOVE_SPEED * dt;
  }

  // 重力の計算
  let g = CONFIG.GRAVITY;

  // 落下中なら重力を強くする
  if (player.vy > 0) {
    g = CONFIG.GRAVITY * CONFIG.FALL_GRAVITY_RATE;
  }

  // 下矢印キーを押している間はヒップドロップ
  if (keys["ArrowDown"] && player.vy > 0) {
    g = CONFIG.GRAVITY * CONFIG.HIP_DROP_GRAVITY_RATE;
  }

  player.vy = player.vy + g * dt;
  player.y = player.y + player.vy * dt;

  collideWithFloor();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#203060";
  ctx.fillRect(floor.x, floor.y, floor.w, floor.h);

  // 目印の線
  ctx.fillStyle = "#ff6b6b";
  ctx.fillRect(0, floor.y - TARGET_HEIGHT, canvas.width, 2);

  ctx.fillStyle = player.isGrounded ? "#7ef5e1" : "#ffd166";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  ctx.fillStyle = "#e8eeff";
  ctx.font = "14px monospace";
  ctx.fillText(
    "vy = " + player.vy.toFixed(0) +
    "   jumpsLeft = " + player.jumpsLeft,
    10, 20
  );

  // ヒップドロップ中の表示
  if (keys["ArrowDown"] && player.vy > 0) {
    ctx.fillText("HIP DROP!", 10, 40);
  }
}

let last = performance.now();

function loop(now) {
  const dt = Math.min((now - last) / 1000, 0.033);
  last = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
