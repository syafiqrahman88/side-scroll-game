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

// Function to draw synthwave background
function drawSynthwaveBackground() {
    // Sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGradient.addColorStop(0, '#120458');
    skyGradient.addColorStop(1, '#ff00a0');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Sun
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height + 50, 200, Math.PI, 2 * Math.PI);
    ctx.fillStyle = '#ff6b6b';
    ctx.fill();

    // Grid
    ctx.beginPath();
    ctx.strokeStyle = '#ff00ff';
    ctx.lineWidth = 2;
    for (let i = 0; i < canvas.width; i += 50) {
        ctx.moveTo(i, canvas.height / 2);
        ctx.lineTo(i, canvas.height);
    }
    for (let j = canvas.height / 2; j < canvas.height; j += 25) {
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
    }
    ctx.stroke();
}

// Game loop
function gameLoop() {
    // Draw background
    drawSynthwaveBackground();

    // Draw sloth
    ctx.drawImage(slothImg, sloth.x, sloth.y, sloth.width, sloth.height);

    // Draw thugs
    thugs.forEach((thug, index) => {
        ctx.drawImage(thugImg, thug.x, thug.y, thug.width, thug.height);
        // Move thugs towards sloth
        if (thug.x > sloth.x) thug.x -= 1;
        else thug.x += 1;
    });

    // Draw bananas
    bananas.forEach((banana, index) => {
        ctx.drawImage(bananaImg, banana.x, banana.y, banana.width, banana.height);
        // Make bananas fall
        banana.y += 2;
        if (banana.y > canvas.height) {
            bananas.splice(index, 1);
        }
    });

    // Draw health bar
    ctx.fillStyle = '#ff00a0';
    ctx.fillRect(10, 10, sloth.health * 2, 20);

    // Check collisions
    checkCollisions();

    // Request next frame
    requestAnimationFrame(gameLoop);
}

function checkCollisions() {
    // Check banana collisions
    bananas.forEach((banana, index) => {
        if (isColliding(sloth, banana)) {
            bananas.splice(index, 1);
            sloth.health = Math.min(sloth.health + 10, 100);
        }
    });

    // Check thug collisions
    thugs.forEach((thug, index) => {
        if (isColliding(sloth, thug)) {
            sloth.health -= 0.1;
        }
    });
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
            sloth.y = Math.max(0, sloth.y - sloth.speed);
            break;
        case 'ArrowDown':
            sloth.y = Math.min(canvas.height - sloth.height, sloth.y + sloth.speed);
            break;
        case 'z':
            // Eat banana
            bananas.forEach((banana, index) => {
                if (isColliding(sloth, banana)) {
                    bananas.splice(index, 1);
                    sloth.health = Math.min(sloth.health + 10, 100);
                }
            });
            break;
        case 'x':
            // Beat thug
            thugs.forEach((thug, index) => {
                if (isColliding(sloth, thug)) {
                    thugs.splice(index, 1);
                }
            });
            break;
    }
});

// Spawn thugs and bananas
setInterval(() => {
    thugs.push({
        x: Math.random() < 0.5 ? 0 : canvas.width,
        y: Math.random() * (canvas.height - 50),
        width: 40,
        height: 40
    });
}, 2000);

setInterval(() => {
    bananas.push({
        x: Math.random() * (canvas.width - 30),
        y: 0,
        width: 30,
        height: 30
    });
}, 5000);
