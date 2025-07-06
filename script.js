const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let gang = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = getRandomFood();
let tanishaHiding = getRandomHidingPlace();
let score = 0;

// Swipe controls for mobile
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", function (e) {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

canvas.addEventListener("touchmove", function (e) {
  const dx = e.touches[0].clientX - touchStartX;
  const dy = e.touches[0].clientY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    direction = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
  } else {
    direction = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
  }

  touchStartX = 0;
  touchStartY = 0;
});

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp": direction = { x: 0, y: -1 }; break;
    case "ArrowDown": direction = { x: 0, y: 1 }; break;
    case "ArrowLeft": direction = { x: -1, y: 0 }; break;
    case "ArrowRight": direction = { x: 1, y: 0 }; break;
  }
});

function gameLoop() {
  update();
  draw();
  setTimeout(gameLoop, 150);
}

function update() {
  const head = { x: gang[0].x + direction.x, y: gang[0].y + direction.y };
  gang.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    tanishaHiding = getRandomHidingPlace();
    food = getRandomFood();
  } else {
    gang.pop();
  }

  if (head.x < 0 || head.y < 0 || head.x >= tileCount || head.y >= tileCount) {
    resetGame();
  }

  for (let i = 1; i < gang.length; i++) {
    if (head.x === gang[i].x && head.y === gang[i].y) {
      resetGame();
    }
  }
}

function draw() {
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00ff00"; // Gang
  gang.forEach(part => {
    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
  });

  ctx.fillStyle = "#ff0066"; // Tanisha hiding object
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

  ctx.fillStyle = "#fff";
  ctx.font = "14px Arial";
  ctx.fillText(tanishaHiding, food.x * gridSize, food.y * gridSize - 5);

  ctx.fillText("Score: " + score, 10, 20);
}

function getRandomFood() {
  return {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount),
  };
}

function getRandomHidingPlace() {
  const places = ["Canteen", "Garden", "Class"];
  return places[Math.floor(Math.random() * places.length)];
}

function resetGame() {
  alert("Game Over! Score: " + score);
  gang = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  score = 0;
  food = getRandomFood();
  tanishaHiding = getRandomHidingPlace();
}

gameLoop();
