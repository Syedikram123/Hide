const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let gang = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = getRandomFood();
let tanishaHiding = getRandomHidingPlace();
let score = 0;

// Mobile buttons use this
function setDirection(x, y) {
  direction = { x, y };
}

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
    document.getElementById("scoreDisplay").textContent = "Score: " + score;
  } else {
    gang.pop();
  }

  // Collision with walls
  if (head.x < 0 || head.y < 0 || head.x >= tileCount || head.y >= tileCount) {
    resetGame();
  }

  // Collision with itself
  for (let i = 1; i < gang.length; i++) {
    if (head.x === gang[i].x && head.y === gang[i].y) {
      resetGame();
    }
  }
}

function draw() {
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw Gang
  ctx.fillStyle = "#00ff00";
  gang.forEach((part) => {
    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
  });

  // Draw Tanisha hiding
  ctx.fillStyle = "#ff0066";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

  // Show hiding spot name
  ctx.fillStyle = "#fff";
  ctx.font = "14px Arial";
  ctx.fillText(tanishaHiding, food.x * gridSize, food.y * gridSize - 5);
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
  alert("Gang crashed! Final Score: " + score);
  gang = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  food = getRandomFood();
  tanishaHiding = getRandomHidingPlace();
  score = 0;
  document.getElementById("scoreDisplay").textContent = "Score: 0";
}

gameLoop();
