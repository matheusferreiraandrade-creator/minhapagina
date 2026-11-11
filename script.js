(function () {
  const canvas = document.getElementById("snake-canvas");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("snake-score");
  const startBtn = document.getElementById("snake-start-btn");

  const box = 15; // Tamanho de cada quadrado
  const tiles = canvas.width / box;
  let snake, food, dx, dy, score, gameLoop;

  function initGame() {
    snake = [{ x: 10 * box, y: 10 * box }];
    dx = box;
    dy = 0;
    score = 0;
    scoreEl.textContent = score;
    spawnFood();

    clearInterval(gameLoop);
    gameLoop = setInterval(draw, 110);
  }

  function spawnFood() {
    food = {
      x: Math.floor(Math.random() * tiles) * box,
      y: Math.floor(Math.random() * tiles) * box
    };
  }

  document.addEventListener("keydown", function (e) {
    // Evita que a página role ao usar as setas enquanto o jogo estiver visível
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      if (canvas.offsetParent !== null) e.preventDefault();
    }

    if (e.key === "ArrowLeft" && dx === 0) { dx = -box; dy = 0; }
    else if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -box; }
    else if (e.key === "ArrowRight" && dx === 0) { dx = box; dy = 0; }
    else if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = box; }
  });

  function draw() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenha a comida
    ctx.fillStyle = "#ff4d4d";
    ctx.fillRect(food.x, food.y, box, box);

    // Desenha a cobra
    for (let i = 0; i < snake.length; i++) {
      ctx.fillStyle = i === 0 ? "#4caf50" : "#81c784";
      ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    // Nova posição da cabeça
    let headX = snake[0].x + dx;
    let headY = snake[0].y + dy;

    // Colisão com paredes ou com o próprio corpo
    const hitWall = headX < 0 || headX >= canvas.width || headY < 0 || headY >= canvas.height;
    const hitSelf = snake.some(part => part.x === headX && part.y === headY);

    if (hitWall || hitSelf) {
      clearInterval(gameLoop);
      alert("Fim de jogo! Pontuação: " + score);
      return;
    }

    const newHead = { x: headX, y: headY };

    // Verifica se comeu
    if (headX === food.x && headY === food.y) {
      score++;
      scoreEl.textContent = score;
      spawnFood();
    } else {
      snake.pop();
    }

    snake.unshift(newHead);
  }

  startBtn.addEventListener("click", initGame);
})();
