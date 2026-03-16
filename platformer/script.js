// DOM Elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const levelDisplay = document.getElementById('level-display');
const coinDisplay = document.getElementById('coin-display');
const messageOverlay = document.getElementById('message-overlay');
const messageDisplay = document.getElementById('message');
const instructionDisplay = document.querySelector('.instruction');

// Menu Elements
const homeMenu = document.getElementById('home-menu');
const shopMenu = document.getElementById('shop-menu');
const gameWrapper = document.getElementById('game-wrapper');
const controlsHint = document.getElementById('controls-hint');
const btnPlay = document.getElementById('btn-play');
const btnShop = document.getElementById('btn-shop');
const btnBack = document.getElementById('btn-back');
const homeTotalCoins = document.getElementById('home-total-coins');
const shopTotalCoins = document.getElementById('shop-total-coins');
const shopItemsContainer = document.getElementById('shop-items');

// Game State & Persistence
let currentLevelIndex = 0;
let coinsCollected = 0; // Coins collected in current level
let gameState = 'menu'; // menu, shop, playing, level_complete, game_over, game_won
let cameraX = 0;

let totalCoins = parseInt(localStorage.getItem('neonHopperCoins')) || 0;
let unlockedSkins = JSON.parse(localStorage.getItem('neonHopperSkins')) || ['#66fcf1'];

const skins = [
    { id: '#66fcf1', name: 'Classic Cyan', price: 0 },
    { id: '#ff3366', name: 'Neon Pink', price: 10 },
    { id: '#FFD700', name: 'Gold Rush', price: 20 },
    { id: '#00ff00', name: 'Radioactive', price: 30 },
    { id: '#9932CC', name: 'Deep Purple', price: 40 },
    { id: '#ffffff', name: 'Ghost White', price: 50 },
];

function saveProgress() {
    localStorage.setItem('neonHopperCoins', totalCoins);
    localStorage.setItem('neonHopperSkins', JSON.stringify(unlockedSkins));
}

function updateMenuUI() {
    homeTotalCoins.innerText = totalCoins;
    shopTotalCoins.innerText = totalCoins;
    renderShop();
}

btnPlay.addEventListener('click', () => {
    homeMenu.classList.remove('active');
    gameWrapper.style.display = 'block';
    controlsHint.style.display = 'flex';
    gameState = 'playing';
    currentLevelIndex = 0;
    loadLevel(0);
});

btnShop.addEventListener('click', () => {
    homeMenu.classList.remove('active');
    shopMenu.classList.add('active');
    gameState = 'shop';
});

btnBack.addEventListener('click', () => {
    shopMenu.classList.remove('active');
    homeMenu.classList.add('active');
    gameState = 'menu';
});

function renderShop() {
    shopItemsContainer.innerHTML = '';
    skins.forEach(skin => {
        const item = document.createElement('div');
        item.className = 'shop-item';
        
        const isUnlocked = unlockedSkins.includes(skin.id);
        const isEquipped = player.color === skin.id;

        item.innerHTML = `
            <div class="skin-preview" style="background-color: ${skin.id}"></div>
            <h3>${skin.name}</h3>
            ${!isUnlocked ? `<div class="price"><span class="coin-icon"></span> ${skin.price}</div>` : ''}
            <button ${!isUnlocked && totalCoins < skin.price ? 'disabled' : ''}>
                ${isEquipped ? 'Equipped' : (isUnlocked ? 'Equip' : 'Buy')}
            </button>
        `;

        const btn = item.querySelector('button');
        btn.addEventListener('click', () => {
            if (!isUnlocked) {
                if (totalCoins >= skin.price) {
                    totalCoins -= skin.price;
                    unlockedSkins.push(skin.id);
                    player.color = skin.id;
                    saveProgress();
                    updateMenuUI();
                }
            } else {
                player.color = skin.id;
                updateMenuUI();
            }
        });

        shopItemsContainer.appendChild(item);
    });
}

// Player Object
const player = {
    x: 50,
    y: 50,
    width: 30,
    height: 30,
    vx: 0,
    vy: 0,
    speed: 0.8,
    maxSpeed: 6,
    jumpStrength: 14,
    gravity: 0.6,
    friction: 0.85,
    grounded: false,
    color: '#66fcf1'
};

const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false
};

// Level Design
const levels = [
    // Level 1
    {
        worldWidth: 1500,
        startX: 50,
        startY: 200,
        requiredCoins: 3,
        platforms: [
            { x: 0, y: 400, w: 1500, h: 100 },
            { x: 350, y: 300, w: 120, h: 20 },
            { x: 550, y: 200, w: 120, h: 20 },
            { x: 800, y: 250, w: 120, h: 20 },
            { x: 1100, y: 320, w: 120, h: 20 }
        ],
        coins: [
            { x: 410, y: 260, size: 12, collected: false },
            { x: 610, y: 160, size: 12, collected: false },
            { x: 860, y: 210, size: 12, collected: false }
        ],
        hazards: []
    },
    // Level 2
    {
        worldWidth: 2200,
        startX: 50,
        startY: 200,
        requiredCoins: 5,
        platforms: [
            { x: 0, y: 400, w: 400, h: 100 },
            { x: 500, y: 320, w: 120, h: 20 },
            { x: 750, y: 230, w: 120, h: 20 },
            { x: 1000, y: 400, w: 300, h: 100 },
            { x: 1450, y: 280, w: 100, h: 20 },
            { x: 1700, y: 180, w: 100, h: 20 },
            { x: 1950, y: 400, w: 250, h: 100 }
        ],
        coins: [
            { x: 200, y: 360, size: 12, collected: false },
            { x: 560, y: 280, size: 12, collected: false },
            { x: 810, y: 190, size: 12, collected: false },
            { x: 1150, y: 360, size: 12, collected: false },
            { x: 1750, y: 140, size: 12, collected: false }
        ],
        hazards: [
            { x: 400, y: 450, w: 600, h: 50 },
            { x: 1300, y: 450, w: 650, h: 50 }
        ]
    },
    // Level 3
    {
        worldWidth: 2600,
        startX: 50,
        startY: 100,
        requiredCoins: 6,
        platforms: [
            { x: 0, y: 400, w: 300, h: 100 },
            { x: 400, y: 320, w: 80, h: 20 },
            { x: 600, y: 240, w: 80, h: 20 },
            { x: 800, y: 160, w: 80, h: 20 },
            { x: 1100, y: 400, w: 200, h: 100 },
            { x: 1450, y: 300, w: 80, h: 20 },
            { x: 1650, y: 200, w: 80, h: 20 },
            { x: 1900, y: 350, w: 120, h: 20 },
            { x: 2200, y: 400, w: 400, h: 100 }
        ],
        coins: [
            { x: 250, y: 360, size: 12, collected: false },
            { x: 440, y: 280, size: 12, collected: false },
            { x: 840, y: 120, size: 12, collected: false },
            { x: 1200, y: 360, size: 12, collected: false },
            { x: 1490, y: 260, size: 12, collected: false },
            { x: 1960, y: 310, size: 12, collected: false }
        ],
        hazards: [
            { x: 300, y: 450, w: 800, h: 50 },
            { x: 1300, y: 450, w: 900, h: 50 }
        ]
    },
    // Level 4 - Vertical emphasis
    {
        worldWidth: 1500,
        startX: 50,
        startY: 400,
        requiredCoins: 4,
        platforms: [
            { x: 0, y: 450, w: 200, h: 50 },
            { x: 300, y: 380, w: 100, h: 20 },
            { x: 150, y: 280, w: 100, h: 20 },
            { x: 350, y: 180, w: 100, h: 20 },
            { x: 600, y: 150, w: 100, h: 20 },
            { x: 850, y: 250, w: 100, h: 20 },
            { x: 1100, y: 350, w: 100, h: 20 },
            { x: 1300, y: 450, w: 200, h: 50 },
        ],
        coins: [
            { x: 350, y: 340, size: 12, collected: false },
            { x: 200, y: 240, size: 12, collected: false },
            { x: 400, y: 140, size: 12, collected: false },
            { x: 1150, y: 310, size: 12, collected: false }
        ],
        hazards: [
            { x: 200, y: 480, w: 1100, h: 30 }
        ]
    },
    // Level 5 - Small jumps
    {
        worldWidth: 2000,
        startX: 50,
        startY: 200,
        requiredCoins: 5,
        platforms: [
            { x: 0, y: 300, w: 150, h: 200 },
            { x: 300, y: 300, w: 50, h: 20 },
            { x: 500, y: 250, w: 50, h: 20 },
            { x: 700, y: 200, w: 50, h: 20 },
            { x: 900, y: 150, w: 50, h: 20 },
            { x: 1100, y: 250, w: 50, h: 20 },
            { x: 1300, y: 350, w: 50, h: 20 },
            { x: 1600, y: 400, w: 400, h: 100 }
        ],
        coins: [
            { x: 325, y: 260, size: 12, collected: false },
            { x: 525, y: 210, size: 12, collected: false },
            { x: 925, y: 110, size: 12, collected: false },
            { x: 1125, y: 210, size: 12, collected: false },
            { x: 1650, y: 360, size: 12, collected: false }
        ],
        hazards: [
            { x: 150, y: 450, w: 1450, h: 50 }
        ]
    },
    // Level 6 - The Gauntlet
    {
        worldWidth: 3500,
        startX: 50,
        startY: 300,
        requiredCoins: 8,
        platforms: [
            { x: 0, y: 400, w: 200, h: 100 },
            { x: 350, y: 350, w: 100, h: 20 },
            { x: 600, y: 300, w: 80, h: 20 },
            { x: 800, y: 200, w: 80, h: 20 },
            { x: 1100, y: 150, w: 50, h: 20 },
            { x: 1350, y: 250, w: 50, h: 20 },
            { x: 1600, y: 350, w: 100, h: 20 },
            { x: 1900, y: 400, w: 150, h: 100 },
            { x: 2200, y: 350, w: 60, h: 20 },
            { x: 2400, y: 250, w: 60, h: 20 },
            { x: 2600, y: 150, w: 60, h: 20 },
            { x: 2900, y: 250, w: 100, h: 20 },
            { x: 3200, y: 400, w: 300, h: 100 }
        ],
        coins: [
            { x: 400, y: 310, size: 12, collected: false },
            { x: 840, y: 160, size: 12, collected: false },
            { x: 1125, y: 110, size: 12, collected: false },
            { x: 1650, y: 310, size: 12, collected: false },
            { x: 1975, y: 360, size: 12, collected: false },
            { x: 2430, y: 210, size: 12, collected: false },
            { x: 2630, y: 110, size: 12, collected: false },
            { x: 3300, y: 360, size: 12, collected: false }
        ],
        hazards: [
            { x: 200, y: 450, w: 1700, h: 50 },
            { x: 2050, y: 450, w: 1150, h: 50 }
        ]
    }
];

let level = null;
let particles = [];

function loadLevel(index) {
    if (index >= levels.length) {
        gameState = 'game_won';
        messageDisplay.innerText = "YOU WIN!";
        instructionDisplay.innerText = "All levels completed! Press [ENTER] for Home";
        messageOverlay.classList.add('active');
        return;
    }
    
    level = JSON.parse(JSON.stringify(levels[index]));
    player.x = level.startX;
    player.y = level.startY;
    player.vx = 0;
    player.vy = 0;
    coinsCollected = 0;
    gameState = 'playing';
    messageOverlay.classList.remove('active');
    particles = [];
    updateUI();
}

function resetLevel() {
    createDeathParticles(player.x + player.width/2, player.y + player.height/2);
    // Move player offscreen temporarily
    player.x = -1000;
    setTimeout(() => {
        player.x = level.startX;
        player.y = level.startY;
        player.vx = 0;
        player.vy = 0;
    }, 500);
}

// Particle System
function createParticles(x, y, color) {
    for (let i = 0; i < 15; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 1,
            color: color
        });
    }
}

function createDeathParticles(x, y) {
    for (let i = 0; i < 30; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 15,
            vy: (Math.random() - 0.5) * 15,
            life: 1,
            color: '#ff3366'
        });
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

function drawParticles() {
    for (let p of particles) {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1.0;
}

// Input Handling
window.addEventListener('keydown', (e) => {
    if (['ArrowLeft','ArrowRight','ArrowUp',' '].includes(e.key)) {
        e.preventDefault();
    }
    if (keys.hasOwnProperty(e.code) && gameState === 'playing') {
        keys[e.code] = true;
    }
    if (e.code === 'Enter') {
        if (gameState === 'level_complete') {
            currentLevelIndex++;
            loadLevel(currentLevelIndex);
        } else if (gameState === 'game_won') {
            gameWrapper.style.display = 'none';
            controlsHint.style.display = 'none';
            homeMenu.classList.add('active');
            messageOverlay.classList.remove('active');
            gameState = 'menu';
            updateMenuUI();
        }
    }
});

window.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = false;
    }
});

function checkCollision(objA, objB) {
    return objA.x < objB.x + objB.w &&
           objA.x + objA.width > objB.x &&
           objA.y < objB.y + objB.h &&
           objA.y + objA.height > objB.y;
}

function checkCircleRectCollision(circle, rect) {
    let testX = circle.x;
    let testY = circle.y;

    if (circle.x < rect.x) testX = rect.x;
    else if (circle.x > rect.x + rect.width) testX = rect.x + rect.width;

    if (circle.y < rect.y) testY = rect.y;
    else if (circle.y > rect.y + rect.height) testY = rect.y + rect.height;

    let distX = circle.x - testX;
    let distY = circle.y - testY;
    let distance = Math.sqrt((distX*distX) + (distY*distY));

    return distance <= circle.size;
}

function updatePhysics() {
    if (keys.ArrowLeft) {
        player.vx -= player.speed;
    }
    if (keys.ArrowRight) {
        player.vx += player.speed;
    }
    
    // Jump logic including some leniency
    if (keys.ArrowUp && player.grounded) {
        player.vy = -player.jumpStrength;
        player.grounded = false;
        createParticles(player.x + player.width/2, player.y + player.height, '#fff');
    }

    player.vx *= player.friction;
    player.vy += player.gravity;

    if (player.vx > player.maxSpeed) player.vx = player.maxSpeed;
    if (player.vx < -player.maxSpeed) player.vx = -player.maxSpeed;

    player.x += player.vx;
    
    if (player.x < 0) {
        player.x = 0;
        player.vx = 0;
    }
    if (player.x + player.width > level.worldWidth) {
        player.x = level.worldWidth - player.width;
        player.vx = 0;
    }

    for (const plat of level.platforms) {
        if (checkCollision(player, plat)) {
            if (player.vx > 0) {
                player.x = plat.x - player.width;
                player.vx = 0;
            } else if (player.vx < 0) {
                player.x = plat.x + plat.w;
                player.vx = 0;
            }
        }
    }

    player.y += player.vy;
    player.grounded = false;

    for (const plat of level.platforms) {
        if (checkCollision(player, plat)) {
            if (player.vy > 0) {
                player.y = plat.y - player.height;
                player.vy = 0;
                player.grounded = true;
            } else if (player.vy < 0) {
                player.y = plat.y + plat.h;
                player.vy = 0;
            }
        }
    }
    
    for (const hazard of level.hazards) {
        // slight forgiveness on hazards (hitbox slightly smaller)
        const hazardHitbox = {
            x: hazard.x + 5,
            y: hazard.y + 10,
            w: hazard.w - 10,
            h: hazard.h - 10
        };
        if (checkCollision(player, hazardHitbox)) {
            resetLevel();
        }
    }
    
    if (player.y > canvas.height + 200) {
        resetLevel();
    }

    const pRect = {x: player.x, y: player.y, width: player.width, height: player.height};
    for (const coin of level.coins) {
        if (!coin.collected && checkCircleRectCollision({x: coin.x, y: coin.y, size: coin.size + 5}, pRect)) {
            coin.collected = true;
            coinsCollected++;
            totalCoins++; // persistent banking per coin collect
            saveProgress();
            createParticles(coin.x, coin.y, '#FFD700');
            updateUI();
            
            if (coinsCollected >= level.requiredCoins) {
                gameState = 'level_complete';
                messageDisplay.innerText = "LEVEL COMPLETE";
                instructionDisplay.innerText = "Press [ENTER] for next level";
                messageOverlay.classList.add('active');
            }
        }
    }
}

function updateUI() {
    levelDisplay.innerText = `Level ${currentLevelIndex + 1}`;
    coinDisplay.innerHTML = `<span class="coin-icon"></span> ${coinsCollected} / ${level.requiredCoins}`;
}

function drawGrid() {
    ctx.strokeStyle = 'rgba(102, 252, 241, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 50;
    const offsetX = Math.floor(cameraX / gridSize) * gridSize;

    for (let x = offsetX; x < offsetX + canvas.width + gridSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(cameraX, y);
        ctx.lineTo(cameraX + canvas.width, y);
        ctx.stroke();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    cameraX += ((player.x - canvas.width / 2 + player.width / 2) - cameraX) * 0.1;
    if (cameraX < 0) cameraX = 0;
    if (cameraX > level.worldWidth - canvas.width) cameraX = level.worldWidth - canvas.width;

    ctx.save();
    ctx.translate(-cameraX, 0);

    drawGrid();
    
    // Draw Platforms (Neon style)
    ctx.fillStyle = '#111';
    ctx.strokeStyle = '#45a29e';
    ctx.lineWidth = 2;
    for (const plat of level.platforms) {
        ctx.shadowColor = '#45a29e';
        ctx.shadowBlur = 10;
        ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
        ctx.strokeRect(plat.x, plat.y, plat.w, plat.h);
        ctx.shadowBlur = 0;
        
        // top accent line
        ctx.fillStyle = '#66fcf1';
        ctx.fillRect(plat.x, plat.y, plat.w, 3);
        ctx.fillStyle = '#111';
    }

    // Draw Hazards (Lava)
    ctx.fillStyle = '#ff003c';
    ctx.strokeStyle = '#ff3366';
    for (const hazard of level.hazards) {
        ctx.shadowColor = '#ff3366';
        ctx.shadowBlur = 15;
        ctx.fillRect(hazard.x, hazard.y, hazard.w, hazard.h);
        ctx.strokeRect(hazard.x, hazard.y, hazard.w, hazard.h);
        ctx.shadowBlur = 0;
        
        ctx.fillStyle = '#ff6688';
        const time = Date.now() / 200;
        for(let i=0; i<hazard.w/30; i++) {
           let wave = Math.sin(time + i) * 5;
           ctx.fillRect(hazard.x + i*30 + 10, hazard.y + 5 + wave, 10, 5);
        }
        ctx.fillStyle = '#ff003c';
    }

    // Draw Coins
    for (const coin of level.coins) {
        if (!coin.collected) {
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 15;
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(coin.x, coin.y + Math.sin(Date.now()/200 + coin.x)*5, coin.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#FFF';
            ctx.beginPath();
            ctx.arc(coin.x - 3, coin.y - 3 + Math.sin(Date.now()/200 + coin.x)*5, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    drawParticles();

    // Draw Player
    if (player.x !== -1000) {
        ctx.shadowColor = player.color;
        ctx.shadowBlur = 20;
        ctx.fillStyle = player.color;
        
        // squash and stretch effect based on velocity
        let stretchY = 1 + Math.abs(player.vy) * 0.02;
        let stretchX = 1 - Math.abs(player.vy) * 0.01;
        if(stretchX < 0.6) stretchX = 0.6;

        ctx.fillRect(
            player.x + (player.width - player.width*stretchX)/2, 
            player.y + (player.height - player.height*stretchY), 
            player.width * stretchX, 
            player.height * stretchY
        );
        ctx.shadowBlur = 0;
        
        // Player eyes
        ctx.fillStyle = '#0b0c10';
        const faceDir = player.vx > 0.5 ? 1 : (player.vx < -0.5 ? -1 : 0);
        ctx.fillRect(player.x + player.width/2 + (faceDir*6) - 5, player.y + 8, 4, 6);
        ctx.fillRect(player.x + player.width/2 + (faceDir*6) + 3, player.y + 8, 4, 6);
    }

    ctx.restore();
}

let lastTime = 0;
function gameLoop(time) {
    if (gameState === 'playing') {
        updatePhysics();
        updateParticles();
        draw();
    }
    requestAnimationFrame(gameLoop);
}

// Initialization
updateMenuUI();
requestAnimationFrame(gameLoop);
