// DOM Elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const levelDisplay = document.getElementById('level-display');
const coinDisplay = document.getElementById('coin-display');
const messageOverlay = document.getElementById('message-overlay');
const messageDisplay = document.getElementById('message');
const instructionDisplay = document.querySelector('.instruction');
const btnReturnMenu = document.getElementById('btn-return-menu'); // New btn

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
let coinsCollected = 0; 
let gameState = 'menu'; // menu, shop, playing, level_complete, game_over, game_won
let cameraX = 0;
let cameraY = 0;

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

function stopPlayingAndGoToMenu() {
    gameWrapper.style.display = 'none';
    controlsHint.style.display = 'none';
    messageOverlay.classList.remove('active');
    homeMenu.classList.add('active');
    gameState = 'menu';
    updateMenuUI();
}

btnReturnMenu.addEventListener('click', () => {
    stopPlayingAndGoToMenu();
});

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
    updateMenuUI(); // Ensure layout calculates
});

btnBack.addEventListener('click', () => {
    shopMenu.classList.remove('active');
    homeMenu.classList.add('active');
    gameState = 'menu';
    updateMenuUI();
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
    baseSpeed: 0.8,
    speed: 0.8,
    baseMaxSpeed: 6,
    maxSpeed: 6,
    jumpStrength: 14,
    gravity: 0.6,
    friction: 0.85,
    grounded: false,
    color: localStorage.getItem('neonHopperSkins') ? (JSON.parse(localStorage.getItem('neonHopperSkins'))[JSON.parse(localStorage.getItem('neonHopperSkins')).length-1]) : '#66fcf1', // Default to last unlocked, or reset when equipping
    boostTimer: 0,
    wallSlidingDir: 0 
};
// Ensure active skin on page load is what is currently equipped visually
if (unlockedSkins.length > 0) {
    player.color = unlockedSkins[unlockedSkins.length-1]; // Lazy equip the latest unlocked
}

const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false
};

// Level Design using new Mechanics
const levels = [
    // Level 1: Very easy, teaches walking and basic jumping
    {
        worldWidth: 1600,
        worldHeight: 800,
        startX: 50,
        startY: 500,
        requiredCoins: 3,
        platforms: [
            { x: 0, y: 700, w: 1600, h: 100 } // One giant flat floor
        ],
        jumpPads: [],
        speedBoosts: [],
        spikes: [],
        hazards: [],
        coins: [
            { x: 400, y: 650, size: 12, collected: false },
            { x: 900, y: 550, size: 12, collected: false }, // Slightly elevated to prompt a jump
            { x: 1300, y: 650, size: 12, collected: false }
        ],
        texts: [
            { text: "Welcome to Neon Hopper!", x: 100, y: 550, size: 36, color: "#66fcf1" },
            { text: "Use Left/Right Arrows to Move.", x: 100, y: 600, size: 20, color: "#c5c6c7" },
            { text: "Use Up Arrow to Jump.", x: 750, y: 500, size: 24, color: "#66fcf1" },
            { text: "Collect all coins to beat the level!", x: 1000, y: 550, size: 24, color: "#FFD700" }
        ]
    },
    // Level 2: Teaches Spikes and Lava Hazards (Removed for ease)
    {
        worldWidth: 2000,
        worldHeight: 800,
        startX: 50,
        startY: 500,
        requiredCoins: 4,
        platforms: [
            { x: 0, y: 700, w: 2000, h: 100 } // Made continuous
        ],
        jumpPads: [],
        speedBoosts: [],
        spikes: [], // Removed
        hazards: [], // Removed
        coins: [
            { x: 400, y: 650, size: 12, collected: false }, 
            { x: 830, y: 550, size: 12, collected: false }, 
            { x: 1100, y: 650, size: 12, collected: false }, 
            { x: 1450, y: 550, size: 12, collected: false } 
        ],
        texts: [
            { text: "Jump over red obstacles! (They were removed for your convenience)", x: 50, y: 450, size: 24, color: "#ff3366" },
            { text: "If you die, the level completely restarts.", x: 50, y: 490, size: 18, color: "#c5c6c7" }
        ]
    },
    // Level 3: Teaches Wall Jumping
    {
        worldWidth: 1500,
        worldHeight: 1200,
        startX: 50,
        startY: 1000,
        requiredCoins: 3,
        platforms: [
            { x: 0, y: 1100, w: 1500, h: 100 }, // Generous starting block spanning the whole floor
            { x: 600, y: 700, w: 100, h: 500 }, // Wall 1
            { x: 900, y: 500, w: 100, h: 700 }, // Wall 2 (spaced further apart so it's easy)
            { x: 1000, y: 500, w: 500, h: 100 } // generous ending block
        ],
        jumpPads: [],
        speedBoosts: [],
        spikes: [], // Removed
        hazards: [],
        coins: [
            { x: 300, y: 1050, size: 12, collected: false },
            { x: 750, y: 800, size: 12, collected: false }, // Between walls
            { x: 1200, y: 450, size: 12, collected: false }
        ],
        texts: [
            { text: "Jump into a wall to slide down slowly.", x: 50, y: 950, size: 24, color: "#66fcf1" },
            { text: "Press Jump while sliding against a wall", x: 600, y: 1050, size: 20, color: "#fff" },
            { text: "to WALL KICK upwards!", x: 600, y: 1080, size: 20, color: "#fff" },
            { text: "Bounce between these walls!", x: 650, y: 600, size: 18, color: "#00ffcc" }
        ]
    },
    // Level 4: Teaches Jump Pads and Speed Boosts
    {
        worldWidth: 2500,
        worldHeight: 1000,
        startX: 50,
        startY: 800,
        requiredCoins: 4,
        platforms: [
            { x: 0, y: 900, w: 2500, h: 100 }, // Replaced spikes with floor
            { x: 700, y: 600, w: 300, h: 50 }, // high up pad destination
            { x: 1200, y: 600, w: 1300, h: 100 } // long stretch
        ],
        jumpPads: [
            { x: 400, y: 880, w: 100, h: 20 } // Massive jump pad
        ],
        speedBoosts: [
            { x: 1300, y: 550, size: 15, collected: false }
        ],
        spikes: [],
        hazards: [],
        coins: [
            { x: 450, y: 650, size: 12, collected: false }, // in the air above pad
            { x: 850, y: 550, size: 12, collected: false }, // on high platform
            { x: 1600, y: 550, size: 12, collected: false },
            { x: 2300, y: 550, size: 12, collected: false }
        ],
        texts: [
            { text: "Step on Jump Pads to launch into the air!", x: 50, y: 750, size: 24, color: "#00ffcc" },
            { text: "Grab Speed Boosts (>>) to zoom across large gaps!", x: 1100, y: 500, size: 24, color: "#00ffcc" }
        ]
    },
    // Level 5: Parkour Cave (Combining mechanics)
    {
        worldWidth: 1500,
        worldHeight: 1800,
        startX: 50,
        startY: 1600,
        requiredCoins: 5,
        platforms: [
            { x: 0, y: 1700, w: 1500, h: 100 }, // Safe floor!
            { x: 400, y: 1500, w: 100, h: 300 },
            { x: 200, y: 1300, w: 100, h: 300 },
            { x: 500, y: 1100, w: 100, h: 300 },
            { x: 800, y: 900, w: 200, h: 20 },
            { x: 1100, y: 700, w: 150, h: 20 },
            { x: 1300, y: 400, w: 100, h: 500 },
            { x: 1000, y: 400, w: 100, h: 500 },
            { x: 500, y: 200, w: 300, h: 100 }
        ],
        jumpPads: [
            { x: 850, y: 880, w: 40, h: 20 },
            { x: 700, y: 1680, w: 100, h: 20 } // extra safety pad
        ],
        speedBoosts: [],
        spikes: [],
        hazards: [],
        coins: [
            { x: 350, y: 1400, size: 12, collected: false },
            { x: 350, y: 1200, size: 12, collected: false },
            { x: 1200, y: 800, size: 12, collected: false },
            { x: 1150, y: 550, size: 12, collected: false }, // Between upper pillars
            { x: 600, y: 150, size: 12, collected: false }
        ],
        texts: [
             { text: "No more tutorials! Put your skills to the test.", x: 50, y: 1550, size: 20, color: "#fff" }
        ]
    },
    // Level 6: The Ultimate Gauntlet
    {
        worldWidth: 3500,
        worldHeight: 1500,
        startX: 50,
        startY: 1200,
        requiredCoins: 8,
        platforms: [
            { x: 0, y: 1300, w: 3500, h: 200 }, // Everything has a safe base
            { x: 400, y: 1250, w: 50, h: 50 },
            { x: 600, y: 1200, w: 50, h: 50 },
            { x: 800, y: 1150, w: 50, h: 50 },
            
            { x: 1100, y: 900, w: 100, h: 600 }, // Wall jump pillar left
            { x: 1350, y: 700, w: 100, h: 800 }, // Wall jump pillar right
            
            { x: 1600, y: 600, w: 200, h: 20 }, // Landing plat
            
            { x: 2000, y: 600, w: 1500, h: 50 }, // Long speed section
            
            { x: 3300, y: 400, w: 100, h: 20 },
            { x: 3000, y: 250, w: 100, h: 20 },
            { x: 3300, y: 100, w: 200, h: 100 }
        ],
        jumpPads: [
            { x: 1650, y: 580, w: 40, h: 20 },
            { x: 3320, y: 380, w: 40, h: 20 },
            { x: 3020, y: 230, w: 40, h: 20 }
        ],
        speedBoosts: [
            { x: 1900, y: 550, size: 15, collected: false },
            { x: 2500, y: 550, size: 15, collected: false }
        ],
        spikes: [],
        hazards: [],
        coins: [
            { x: 500, y: 1200, size: 12, collected: false },
            { x: 1250, y: 1000, size: 12, collected: false }, // Between wall jump pillars
            { x: 1250, y: 800, size: 12, collected: false }, // Between wall jump pillars higher
            { x: 2300, y: 520, size: 12, collected: false }, // along speed path
            { x: 2900, y: 520, size: 12, collected: false }, // along speed path
            { x: 3350, y: 300, size: 12, collected: false }, // jump pad ascension
            { x: 3050, y: 150, size: 12, collected: false }, // jump pad ascension
            { x: 3400, y: 50, size: 12, collected: false }   // Final coin
        ],
        texts: []
    }
];

let level = null;
let particles = [];

function loadLevel(index) {
    if (index >= levels.length) {
        // Just let them keep playing or exit. We will exit them.
        gameState = 'game_won';
        messageDisplay.innerText = "YOU WIN!";
        instructionDisplay.innerText = "All levels completed! Press [ENTER] for Home";
        messageOverlay.classList.add('active');
        return;
    }
    
    // Deep clone the level so we don't permanently modify the template's collected coins
    level = JSON.parse(JSON.stringify(levels[index])); 
    
    player.x = level.startX;
    player.y = level.startY;
    player.vx = 0;
    player.vy = 0;
    player.boostTimer = 0;
    player.maxSpeed = player.baseMaxSpeed;
    player.speed = player.baseSpeed;
    
    coinsCollected = 0;
    
    gameState = 'playing';
    messageOverlay.classList.remove('active');
    particles = [];
    updateUI();
}

function resetLevel() {
    createDeathParticles(player.x + player.width/2, player.y + player.height/2);
    player.x = -1000;
    
    // Wait for death animation then restart from clean slate (coins reset, etc)
    setTimeout(() => {
        if(gameState === 'playing') {
            loadLevel(currentLevelIndex);
        }
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
            stopPlayingAndGoToMenu();
        }
    }
    
    // Escape goes to menu
    if (e.code === 'Escape' && (gameState === 'playing' || gameState === 'level_complete')) {
        stopPlayingAndGoToMenu();
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
    // Speed Boost Logic
    if (player.boostTimer > 0) {
        player.boostTimer--;
        player.maxSpeed = player.baseMaxSpeed * 1.8;
        player.speed = player.baseSpeed * 1.5;
        if (player.boostTimer % 5 === 0) {
            createParticles(player.x + player.width/2, player.y + player.height, '#00ffcc');
        }
    } else {
        player.maxSpeed = player.baseMaxSpeed;
        player.speed = player.baseSpeed;
    }

    // Horizontal Movement
    if (keys.ArrowLeft) {
        player.vx -= player.speed;
    }
    if (keys.ArrowRight) {
        player.vx += player.speed;
    }
    
    player.vx *= player.friction;
    if (player.vx > player.maxSpeed) player.vx = player.maxSpeed;
    if (player.vx < -player.maxSpeed) player.vx = -player.maxSpeed;

    player.x += player.vx;
    
    // Bounds Check horizontal
    if (player.x < 0) {
        player.x = 0;
        player.vx = 0;
    }
    if (player.x + player.width > level.worldWidth) {
        player.x = level.worldWidth - player.width;
        player.vx = 0;
    }

    player.wallSlidingDir = 0; // Reset
    for (const plat of level.platforms) {
        if (checkCollision(player, plat)) {
            if (player.vx > 0) {
                player.x = plat.x - player.width;
                player.vx = 0;
                player.wallSlidingDir = 1; // touching right wall
            } else if (player.vx < 0) {
                player.x = plat.x + plat.w;
                player.vx = 0;
                player.wallSlidingDir = -1; // touching left wall
            }
        }
    }

    // Vertical Movement
    let applyGravity = player.gravity;

    // Wall slide logic
    if (player.wallSlidingDir !== 0 && !player.grounded && player.vy > 0) {
        // Only wall slide if pushing against the wall
        if ((player.wallSlidingDir === 1 && keys.ArrowRight) || (player.wallSlidingDir === -1 && keys.ArrowLeft)) {
            applyGravity = 0.1; // Slow falling
            if (player.vy > 3) player.vy = 3;
            // Spawn sparks
            if (Math.random() < 0.3) {
                createParticles(player.wallSlidingDir === 1 ? player.x + player.width : player.x, player.y + player.height/2, '#fff');
            }
        }
    }

    player.vy += applyGravity;

    // Jumping
    if (keys.ArrowUp) {
        if (player.grounded) {
            player.vy = -player.jumpStrength;
            player.grounded = false;
            createParticles(player.x + player.width/2, player.y + player.height, '#fff');
            keys.ArrowUp = false; // require re-press
        } else if (player.wallSlidingDir !== 0) {
            // Wall jump
            player.vy = -player.jumpStrength * 0.9;
            player.vx = -player.wallSlidingDir * player.maxSpeed * 1.5; // kick off
            player.wallSlidingDir = 0;
            createParticles(player.x + player.width/2, player.y + player.height/2, '#00ffcc');
            keys.ArrowUp = false;
        }
    }

    player.y += player.vy;
    player.grounded = false;

    // Vertical Platforms
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

    // Jump Pads
    for (const pad of level.jumpPads) {
        if (checkCollision(player, pad)) {
            player.vy = -player.jumpStrength * 1.6; // Super jump!
            player.grounded = false;
            createParticles(pad.x + pad.w/2, pad.y, '#00ffcc');
        }
    }

    // Speed Boosts
    const pRect = {x: player.x, y: player.y, width: player.width, height: player.height};
    for (const boost of level.speedBoosts) {
        if (!boost.collected && checkCircleRectCollision({x: boost.x, y: boost.y, size: boost.size + 5}, pRect)) {
            boost.collected = true;
            player.boostTimer = 300; // 5 seconds at 60fps
            createParticles(boost.x, boost.y, '#00ffcc');
        }
    }

    // Spikes
    for (const spike of level.spikes) {
        // smaller forgiving hitbox
        const spikeHitbox = {
            x: spike.x + 5,
            y: spike.y + 10,
            w: spike.w - 10,
            h: spike.h - 10
        };
        if (checkCollision(player, spikeHitbox)) {
            resetLevel();
            return; // stop physics
        }
    }

    // Lava Hazards
    for (const hazard of level.hazards) {
        const hazardHitbox = {
            x: hazard.x + 5,
            y: hazard.y + 10,
            w: hazard.w - 10,
            h: hazard.h - 10
        };
        if (checkCollision(player, hazardHitbox)) {
            resetLevel();
            return; 
        }
    }
    
    // Death pit bounds check
    if (player.y > level.worldHeight + 200 || player.y > (level.worldHeight || 2000)) {
        resetLevel();
        return;
    }

    // Coins Check
    for (const coin of level.coins) {
        if (!coin.collected && checkCircleRectCollision({x: coin.x, y: coin.y, size: coin.size + 5}, pRect)) {
            coin.collected = true;
            coinsCollected++;
            createParticles(coin.x, coin.y, '#FFD700');
            updateUI();
            
            if (coinsCollected >= level.requiredCoins) {
                // Wait until level completed to actually store coins persistently
                // so they can't farm coins by dying
                totalCoins += level.requiredCoins; 
                saveProgress();

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
    const offsetY = Math.floor(cameraY / gridSize) * gridSize;

    for (let x = offsetX; x < offsetX + canvas.width + gridSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, cameraY);
        ctx.lineTo(x, cameraY + canvas.height);
        ctx.stroke();
    }
    for (let y = offsetY; y < offsetY + canvas.height + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(cameraX, y);
        ctx.lineTo(cameraX + canvas.width, y);
        ctx.stroke();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Smooth Camera Follow X and Y
    cameraX += ((player.x - canvas.width / 2 + player.width / 2) - cameraX) * 0.1;
    cameraY += ((player.y - canvas.height / 2 + player.height / 2) - cameraY) * 0.1;

    // Clamp Camera
    if (cameraX < 0) cameraX = 0;
    if (cameraX > level.worldWidth - canvas.width) cameraX = level.worldWidth - canvas.width;
    
    let maxCamY = (level.worldHeight || 1500) - canvas.height;
    if (cameraY < -200) cameraY = -200; 
    if (cameraY > maxCamY) cameraY = maxCamY;

    ctx.save();
    ctx.translate(-cameraX, -cameraY);

    drawGrid();
    
    // Draw Texts
    if (level.texts) {
        for (const t of level.texts) {
            ctx.fillStyle = t.color || '#fff';
            ctx.font = `600 ${t.size}px Outfit, sans-serif`;
            ctx.shadowColor = t.color || '#fff';
            ctx.shadowBlur = 10;
            ctx.fillText(t.text, t.x, t.y);
            ctx.shadowBlur = 0;
        }
    }

    // Draw Platforms 
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

    // Draw Jump Pads
    for (const pad of level.jumpPads) {
        ctx.shadowColor = '#00ffcc';
        ctx.shadowBlur = 15;
        
        // Pulsing effect
        const pulse = Math.abs(Math.sin(Date.now() / 200)) * 5;
        ctx.fillStyle = '#00ffcc';
        ctx.fillRect(pad.x, pad.y - pulse, pad.w, pad.h + pulse);
        
        ctx.fillStyle = '#fff';
        ctx.fillRect(pad.x + pad.w/2 - 5, pad.y - pulse + 5, 10, 5); // arrow up
        
        ctx.shadowBlur = 0;
    }

    // Draw Spikes
    ctx.fillStyle = '#ff003c';
    ctx.shadowColor = '#ff3366';
    ctx.shadowBlur = 10;
    for (const spike of level.spikes) {
        const numSpikes = Math.floor(spike.w / 20);
        for(let i=0; i<numSpikes; i++) {
            ctx.beginPath();
            ctx.moveTo(spike.x + i*20 + 10, spike.y); // tip
            ctx.lineTo(spike.x + i*20 + 20, spike.y + spike.h); // right base
            ctx.lineTo(spike.x + i*20, spike.y + spike.h); // left base
            ctx.fill();
        }
    }
    ctx.shadowBlur = 0;

    // Draw Lava Hazards
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

    // Draw Speed Boosts
    for (const boost of level.speedBoosts) {
        if (!boost.collected) {
            ctx.shadowColor = '#00ffcc';
            ctx.shadowBlur = 15;
            
            const time = Date.now() / 150;
            ctx.fillStyle = '#00ffcc';
            ctx.beginPath();
            // Draw dual chevrons >>
            ctx.moveTo(boost.x - 5, boost.y - 10 + Math.sin(time)*3);
            ctx.lineTo(boost.x + 5, boost.y + Math.sin(time)*3);
            ctx.lineTo(boost.x - 5, boost.y + 10 + Math.sin(time)*3);
            ctx.lineTo(boost.x - 10, boost.y + 10 + Math.sin(time)*3);
            ctx.lineTo(boost.x, boost.y + Math.sin(time)*3);
            ctx.lineTo(boost.x - 10, boost.y - 10 + Math.sin(time)*3);
            
            ctx.moveTo(boost.x + 5, boost.y - 10 + Math.sin(time)*3);
            ctx.lineTo(boost.x + 15, boost.y + Math.sin(time)*3);
            ctx.lineTo(boost.x + 5, boost.y + 10 + Math.sin(time)*3);
            ctx.lineTo(boost.x, boost.y + 10 + Math.sin(time)*3);
            ctx.lineTo(boost.x + 10, boost.y + Math.sin(time)*3);
            ctx.lineTo(boost.x, boost.y - 10 + Math.sin(time)*3);
            
            ctx.fill();
            ctx.shadowBlur = 0;
        }
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
        // Boost trail trailing
        if (player.boostTimer > 0) {
            ctx.fillStyle = player.color;
            ctx.globalAlpha = 0.3;
            ctx.fillRect(player.x - player.vx*1.5, player.y - player.vy*1.5, player.width, player.height);
            ctx.globalAlpha = 0.15;
            ctx.fillRect(player.x - player.vx*3, player.y - player.vy*3, player.width, player.height);
            ctx.globalAlpha = 1.0;
        }

        ctx.shadowColor = player.color;
        ctx.shadowBlur = player.boostTimer > 0 ? 30 : 20;
        ctx.fillStyle = player.color;
        
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

function gameLoop(time) {
    if (gameState === 'playing') {
        updatePhysics();
    }
    // Update visuals during menu, success screen, etc.
    updateParticles(); 
    if(gameState === 'playing' || gameState === 'level_complete') {
        draw();
    }
    
    requestAnimationFrame(gameLoop);
}

// Initialization
updateMenuUI();
requestAnimationFrame(gameLoop);
