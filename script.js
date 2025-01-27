const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let direction = 'right';
let gameLoopInterval;
let score = 0;
let particles = []; // Array to store particle objects

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
}

function generateParticles(x, y) {
    for (let i = 0; i < 10; i++) { // Generate 10 particles
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 2, // Random velocity x
            vy: (Math.random() - 0.5) * 2, // Random velocity y
            alpha: 1, // Alpha (opacity)
            color: `hsl(${270 + Math.random() * 30}, 100%, 50%)` // Iridescent purple color
        });
    }
}

function drawParticles() {
    particles.forEach((particle, index) => {
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.alpha;
        ctx.fillRect(particle.x, particle.y, 2, 2); // Small square particles
    });
    ctx.globalAlpha = 1; // Reset alpha
}

function updateParticles() {
    particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.alpha -= 0.02; // Fade out effect

        if (particle.alpha <= 0) {
            particles.splice(index, 1); // Remove faded particles
        }
    });
}

function drawGrid() {
    ctx.lineWidth = 0.2;
    for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.strokeStyle = '#0ff'; // Default neon cyan
        ctx.lineDashOffset = Date.now() / 50; // Dynamic offset for movement
        ctx.setLineDash([5, 5]); // Dashed line effect
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.strokeStyle = '#0ff'; // Default neon cyan
        ctx.lineDashOffset = Date.now() / 50; // Dynamic offset for movement
        ctx.setLineDash([5, 5]); // Dashed line effect
        ctx.stroke();
    }
    ctx.setLineDash([]); // Reset line dash for other elements
}

function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = `hsl(${270 + index * 5}, 100%, 50%)`; // Iridescent purple
        ctx.shadowColor = `hsl(${270 + index * 5}, 100%, 50%)`;
        ctx.shadowBlur = 10;
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);

        ctx.shadowBlur = 0; // Reset shadow for next elements
    });
}

function drawFood() {
    ctx.fillStyle = 'purple'; // Sparkling purple cupcake color
    ctx.shadowColor = 'purple';
    ctx.shadowBlur = 15;
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    ctx.shadowBlur = 0;
}

function update() {
    const head = { x: snake[0].x, y: snake[0].y };

    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
        generateParticles(head.x * gridSize, head.y * gridSize); // Particles on food eat
    } else {
        snake.pop();
    }

    snake.unshift(head);
    generateParticles(head.x * gridSize, head.y * gridSize); // Particles on move

    // Wall wrapping logic
    if (head.x < 0) {
        head.x = canvas.width / gridSize - 1; // Wrap to right edge
    } else if (head.x >= canvas.width / gridSize) {
        head.x = 0; // Wrap to left edge
    }
    if (head.y < 0) {
        head.y = canvas.height / gridSize - 1; // Wrap to bottom edge
    } else if (head.y >= canvas.height / gridSize) {
        head.y = 0; // Wrap to top edge
    }

    if (checkCollision()) {
        clearInterval(gameLoopInterval);
        alert(`Game Over! Score: ${score}`);
        snake = [{ x: 10, y: 10 }];
        direction = 'right';
        score = 0;
        generateFood();
        startGame(); // Restart game
        return;
    }
}

function checkCollision() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    return false;
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawFood();
    drawSnake();
    drawParticles(); // Draw particles every frame
    updateParticles(); // Update particles every frame
}

function gameLoop() {
    update();
    draw();
}

function startGame() {
    if(gameLoopInterval) {
        clearInterval(gameLoopInterval); // Clear existing interval if any
    }
    gameLoopInterval = setInterval(gameLoop, 100); // Game speed
}


document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
});

generateFood();
startGame();
