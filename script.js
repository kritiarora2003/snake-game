const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const menu = document.getElementById("menu");
const gameOverScreen = document.getElementById("game-over");

const grid = 30; // bigger grid size
let count, snake, dx, dy, food, speed;

function resetGame() {
    count = 0;
    snake = [{ x: 300, y: 300 }];
    dx = grid;
    dy = 0;
    food = {
        x: Math.floor(Math.random() * (canvas.width / grid)) * grid,
        y: Math.floor(Math.random() * (canvas.height / grid)) * grid
    };
    speed = 10; // start slow (higher = slower)
}

let animationId;

function startGame() {
    cancelAnimationFrame(animationId); // stop old loop if any
    resetGame();                       // reset speed, snake, etc.
    menu.style.display = "none";
    gameOverScreen.style.display = "none";
    canvas.style.display = "block";

    animationId = requestAnimationFrame(loop); // start fresh loop
}


function endGame() {
    cancelAnimationFrame(animationId); // stop the loop
    canvas.style.display = "none";
    gameOverScreen.style.display = "block";
}

function loop() {
    animationId = requestAnimationFrame(loop); // store ID each time

    if (++count < speed) return;
    count = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // move snake
    let head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // eat food
    if (head.x === food.x && head.y === food.y) {
        food.x = Math.floor(Math.random() * (canvas.width / grid)) * grid;
        food.y = Math.floor(Math.random() * (canvas.height / grid)) * grid;

        // increase speed slightly each time you eat
        if (speed > 5) speed -= 0.5;
    } else {
        snake.pop();
    }

    // check collisions
    if (head.x < 0 || head.y < 0 ||
        head.x >= canvas.width || head.y >= canvas.height ||
        snake.slice(1).some(s => s.x === head.x && s.y === head.y)) {
        endGame();
        return;
    }

    // draw snake
    ctx.fillStyle = "#0f0";
    snake.forEach(s => ctx.fillRect(s.x, s.y, grid - 2, grid - 2));

    // draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, grid - 2, grid - 2);
}


document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft" && dx === 0) { dx = -grid; dy = 0; }
    if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -grid; }
    if (e.key === "ArrowRight" && dx === 0) { dx = grid; dy = 0; }
    if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = grid; }
});

// Mobile Controls
const upBtn = document.getElementById("up");
const leftBtn = document.getElementById("left");
const rightBtn = document.getElementById("right");
const downBtn = document.getElementById("down");

function handleInput(direction) {
    if (direction === "left" && dx === 0) { dx = -grid; dy = 0; }
    if (direction === "up" && dy === 0) { dx = 0; dy = -grid; }
    if (direction === "right" && dx === 0) { dx = grid; dy = 0; }
    if (direction === "down" && dy === 0) { dx = 0; dy = grid; }
}

upBtn.addEventListener("touchstart", (e) => { e.preventDefault(); handleInput("up"); });
leftBtn.addEventListener("touchstart", (e) => { e.preventDefault(); handleInput("left"); });
rightBtn.addEventListener("touchstart", (e) => { e.preventDefault(); handleInput("right"); });
downBtn.addEventListener("touchstart", (e) => { e.preventDefault(); handleInput("down"); });

// Also support click for testing on desktop with mouse
upBtn.addEventListener("click", () => handleInput("up"));
leftBtn.addEventListener("click", () => handleInput("left"));
rightBtn.addEventListener("click", () => handleInput("right"));
downBtn.addEventListener("click", () => handleInput("down"));
