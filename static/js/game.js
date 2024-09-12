const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;

const FLOOR_HEIGHT = canvas.height / 2;

// Game objects
const sloth = {
    x: 50,
    y: FLOOR_HEIGHT,
    width: 50,
    height: 50,
    speed: 7,
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

// Audio
const audio = new Audio('/static/audio/synthwave.mid');
audio.loop = true;

// Function to draw synthwave background
function drawSynthwaveBackground() {
    // Sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, FLOOR_HEIGHT);
    skyGradient.addColorStop(0, '#120458');
    skyGradient.addColorStop(1, '#ff00a0');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, FLOOR_HEIGHT);

    // Sun
    ctx.beginPath();
    ctx.arc(canvas.width / 2, FLOOR_HEIGHT, 75, Math.PI, 2 * Math.PI);
    ctx.fillStyle = '#ff6b6b';
    ctx.fill();

    // Grid
    ctx.beginPath();
    ctx.strokeStyle = '#ff00ff';
    ctx.lineWidth = 2;
    for (let i = 0; i < canvas.width; i += 50) {
        ctx.moveTo(i, FLOOR_HEIGHT / 2);
        ctx.lineTo(i, FLOOR_HEIGHT);
    }
    for (let j = FLOOR_HEIGHT / 2; j < FLOOR_HEIGHT; j += 25) {
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
    }
    ctx.stroke();

    // Floor
    ctx.fillStyle = '#4b0082'; // Contrasting color for the floor
    ctx.fillRect(0, FLOOR_HEIGHT, canvas.width, FLOOR_HEIGHT);
}

// Game loop
function gameLoop() {
    // Clear canvas and draw background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSynthwaveBackground();

    // Draw sloth
    ctx.drawImage(slothImg, sloth.x, sloth.y, sloth.width, sloth.height);

    // Draw thugs
    thugs.forEach((thug, index) => {
        ctx.drawImage(thugImg, thug.x, thug.y, thug.width, thug.height);
        // Move thugs towards the left
        thug.x -= 1; // Slower speed for thugs
        if (thug.x + thug.width < 0) {
            thugs.splice(index, 1);
        }
        // Check collision with sloth
        if (isColliding(sloth, thug)) {
            sloth.health = Math.max(0, sloth.health - 0.5);
        }
    });

    // Draw bananas
    bananas.forEach((banana) => {
        ctx.drawImage(bananaImg, banana.x, banana.y, banana.width, banana.height);
    });

    // Draw health bar
    ctx.fillStyle = '#ff00a0';
    ctx.fillRect(10, 10, sloth.health * 2, 20);

    // Check for game over
    if (sloth.health <= 0) {
        alert("Game Over! Your sloth has run out of health.");
        document.location.reload(); // Reload the game
    }

    // Request next frame
    requestAnimationFrame(gameLoop);
}

function isColliding(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// Start game loop
gameLoop();

// Event listeners for keyboard controls
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            sloth.x = Math.max(0, sloth.x - sloth.speed);
            break;
        case 'ArrowRight':
            sloth.x = Math.min(canvas.width - sloth.width, sloth.x + sloth.speed);
            break;
        case 'ArrowUp':
            sloth.y = Math.max(FLOOR_HEIGHT, sloth.y - sloth.speed); // Allow upward movement but restrict to floor
            break;
        case 'ArrowDown':
            sloth.y = Math.min(FLOOR_HEIGHT + sloth.height, sloth.y + sloth.speed); // Allow downward movement but restrict to floor
            break;
        case '1':
            // Eat banana
            bananas.forEach((banana, index) => {
                if (isColliding(sloth, banana)) {
                    bananas.splice(index, 1);
                    sloth.health = Math.min(sloth.health + 10, 100);
                }
            });
            break;
        case '2':
            // Beat thug
            thugs.forEach((thug, index) => {
                if (isColliding(sloth, thug)) {
                    thugs.splice(index, 1);
                }
            });
            break;
    }
});

// Spawn thugs
setInterval(() => {
    thugs.push({
        x: canvas.width,
        y: FLOOR_HEIGHT + Math.random() * (FLOOR_HEIGHT - 50),
        width: 40,
        height: 40
    });
}, 2000);

// Spawn bananas
setInterval(() => {
    bananas.push({
        x: Math.random() * (canvas.width - 30),
        y: FLOOR_HEIGHT + Math.random() * (FLOOR_HEIGHT - 30),
        width: 30,
        height: 30
    });
}, 5000);

// Start background music
document.addEventListener('click', () => {
    audio.play();
});
