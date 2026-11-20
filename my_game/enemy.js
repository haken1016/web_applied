// 敵：作る・入れる・動かす・描く（足すものの形）

// ① 作る：敵を1体作って返す関数（呼ぶたびに、新しい敵が1体できる）
function createEnemy(x, vx) {
  return {
    x: x,
    y: floor.y - 32,
    w: 32,
    h: 32,
    vx: vx,
    alive: true
  };
}

// ② 入れる：敵をまとめて入れる配列（７-６で入れ直すので let）
let enemies = [];

enemies.push(createEnemy(200, 80));     // 普通の敵
enemies.push(createEnemy(380, -120));   // 普通の敵
enemies.push(createEnemy(540, 60));     // 普通の敵

// ★追加：見張り敵
const watcher = createEnemy(400, 80);
watcher.startX = 400;   // 生まれた場所を覚える
watcher.watch = true;   // 見張りモード
enemies.push(watcher);

// ③ 動かす：配列の敵を1体ずつ取り出して、同じ処理をする
function updateEnemies(dt) {
  for (const enemy of enemies) {

    enemy.x = enemy.x + enemy.vx * dt;

    // ★見張り敵だけの処理
    if (enemy.watch) {

      if (enemy.x < enemy.startX - 80) {
        enemy.x = enemy.startX - 80;
        enemy.vx = -enemy.vx;
      }

      if (enemy.x > enemy.startX + 80) {
        enemy.x = enemy.startX + 80;
        enemy.vx = -enemy.vx;
      }

    } else {

      // 元の敵の処理はそのまま
      if (enemy.x < 0) {
        enemy.x = 0;
        enemy.vx = -enemy.vx;
      }

      if (enemy.x + enemy.w > canvas.width) {
        enemy.x = canvas.width - enemy.w;
        enemy.vx = -enemy.vx;
      }

    }
  }
}

// プレイヤーとぶつかったとき：上から落ちてきたときだけ、敵を倒す
function collideWithEnemies(prevBottom) {
  for (const enemy of enemies) {
    if (aabb(player, enemy) && prevBottom <= enemy.y && player.vy > 0) {
      enemy.alive = false;
      player.vy = -JUMP_SPEED / 2;
    }
  }

  enemies = enemies.filter((enemy) => enemy.alive);
}

// ④ 描く：配列の敵を1体ずつ取り出して描く
function drawEnemies() {
  ctx.fillStyle = "#ff6b6b";

  for (const enemy of enemies) {
    ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);
  }

  ctx.fillStyle = "#e8eeff";
  ctx.fillText("敵 = " + enemies.length, 10, 40);
}