const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;

// Game objects
const sloth = {
    x: 50,
    y: 300,
    width: 50,
    height: 50,
    speed: 5,
    health: 100
};

const thugs = [];
const bananas = [];

// Load images
const slothImg = new Image();
slothImg.src = '/static/images/sloth.png';

const thugImg = new Image();
thugImg.src = '/static/images/thug.png';

const bananaImg = new Image();
bananaImg.src = '/static/images/banana.png';

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.fillStyle = '#120458';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw sloth
    ctx.drawImage(slothImg, sloth.x, sloth.y, sloth.width, sloth.height);

    // Draw thugs
    thugs.forEach(thug => {
        ctx.drawImage(thugImg, thug.x, thug.y, thug.width, thug.height);
    });

    // Draw bananas
    bananas.forEach(banana => {
        ctx.drawImage(bananaImg, banana.x, banana.y, banana.width, banana.height);
    });

    // Draw health bar
    ctx.fillStyle = '#ff00a0';
    ctx.fillRect(10, 10, sloth.health * 2, 20);

    // Request next frame
    requestAnimationFrame(gameLoop);
}

// Start game loop
gameLoop();

// Event listeners for keyboard controls
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            sloth.x -= sloth.speed;
            break;
        case 'ArrowRight':
            sloth.x += sloth.speed;
            break;
        case 'ArrowUp':
            sloth.y -= sloth.speed;
            break;
        case 'ArrowDown':
            sloth.y += sloth.speed;
            break;
        case ' ':
            // Attack
            break;
    }
});

// Spawn thugs and bananas
setInterval(() => {
    thugs.push({
        x: canvas.width,
        y: Math.random() * (canvas.height - 50),
        width: 40,
        height: 40
    });
}, 2000);

setInterval(() => {
    bananas.push({
        x: Math.random() * canvas.width,
        y: 0,
        width: 30,
        height: 30
    });
}, 5000);
