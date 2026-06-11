import { SpatialGrid } from './spatialGrid.js';
import { AStar } from './astar.js';
import { Unit } from './unit.js';
import { AIBehavior } from './aiBehavior.js';
import { InputHandler } from './inputHandler.js';
import { GameLoop } from './gameLoop.js';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const GRID_CELL_SIZE = 40;
const ASTAR_CELL_SIZE = 40;

const gameState = {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    units: [],
    projectiles: [],
    particles: [],
    obstacles: [],
    debugMode: false,
    minimapVisible: true,
    minimap: {
        x: CANVAS_WIDTH - 160,
        y: 10,
        w: 150,
        h: 120
    }
};

function generateObstacles(count, width, height) {
    const obstacles = [];
    const minSize = 50;
    const maxSize = 100;
    const margin = 30;
    const safeZone = { x: 0, y: 0, w: 200, h: height };
    let attempts = 0;
    const maxAttempts = 500;

    while (obstacles.length < count && attempts < maxAttempts) {
        attempts++;
        const w = minSize + Math.random() * (maxSize - minSize);
        const h = minSize + Math.random() * (maxSize - minSize);
        const x = margin + Math.random() * (width - w - margin * 2);
        const y = margin + Math.random() * (height - h - margin * 2);

        const newObs = { x, y, w, h };

        if (x < safeZone.x + safeZone.w &&
            x + w > safeZone.x &&
            y < safeZone.y + safeZone.h &&
            y + h > safeZone.y) {
            continue;
        }

        let overlapping = false;
        for (const obs of obstacles) {
            if (rectsOverlap(newObs, obs, 20)) {
                overlapping = true;
                break;
            }
        }

        if (!overlapping) {
            obstacles.push(newObs);
        }
    }

    return obstacles;
}

function rectsOverlap(a, b, padding = 0) {
    return !(
        a.x + a.w + padding < b.x ||
        b.x + b.w + padding < a.x ||
        a.y + a.h + padding < b.y ||
        b.y + b.h + padding < a.y
    );
}

function initGame() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }

    gameState.obstacles = generateObstacles(6, CANVAS_WIDTH, CANVAS_HEIGHT);

    gameState.spatialGrid = new SpatialGrid(CANVAS_WIDTH, CANVAS_HEIGHT, GRID_CELL_SIZE);

    const astarCols = Math.ceil(CANVAS_WIDTH / ASTAR_CELL_SIZE);
    const astarRows = Math.ceil(CANVAS_HEIGHT / ASTAR_CELL_SIZE);
    gameState.astar = new AStar(astarCols, astarRows, ASTAR_CELL_SIZE);
    gameState.astar.setObstacles(gameState.obstacles);

    gameState.aiBehavior = new AIBehavior({
        separationWeight: 1.8,
        alignmentWeight: 0.6,
        cohesionWeight: 0.8,
        separationRadius: 55,
        neighborRadius: 130
    });

    gameState.inputHandler = new InputHandler(canvas, gameState);

    spawnInitialUnits();

    const gameLoop = new GameLoop(canvas, gameState);
    gameLoop.start();

    setupDebugToggle();
    setupMinimapToggle();

    console.log('RTS 战斗模拟器已启动！');
    console.log('操作说明:');
    console.log('  - 左键点击地面: 创建蓝色坦克 (最多10辆)');
    console.log('  - 左键点击坦克: 选中坦克');
    console.log('  - 左键拖拽: 框选多辆坦克');
    console.log('  - 右键点击地面: 移动选中的坦克');
    console.log('  - 右键点击敌方坦克: 攻击目标');
    console.log('  - Shift+点击: 追加选择');
    console.log('  - 小地图: 点击选择，右键移动');
    console.log('  - "隐藏/显示小地图按钮: 切换小地图显隐');
}

function spawnInitialUnits() {
    const enemyPositions = [
        { x: 650, y: 100 },
        { x: 700, y: 300 },
        { x: 650, y: 500 }
    ];

    for (const pos of enemyPositions) {
        const enemy = new Unit(pos.x, pos.y, 'enemy', {
            speed: 55,
            detectionRange: 220
        });
        gameState.units.push(enemy);
        gameState.spatialGrid.insert(enemy);
    }

    console.log('初始敌方坦克已生成: 3辆');
}

function setupDebugToggle() {
    const toggleBtn = document.getElementById('debugToggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            gameState.debugMode = !gameState.debugMode;
            toggleBtn.textContent = gameState.debugMode ? '关闭调试模式' : '开启调试模式';
            console.log(`调试模式: ${gameState.debugMode ? '开启' : '关闭'}`);
        });
    }
}

function setupMinimapToggle() {
    const toggleBtn = document.getElementById('minimapToggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            gameState.minimapVisible = !gameState.minimapVisible;
            toggleBtn.textContent = gameState.minimapVisible ? '隐藏小地图' : '显示小地图';
            console.log(`小地图: ${gameState.minimapVisible ? '显示' : '隐藏'}`);
        });
    }
}

function setupRoundRectPolyfill() {
    if (!CanvasRenderingContext2D.prototype.roundRect) {
        CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
            if (typeof r === 'number') {
                r = { tl: r, tr: r, br: r, bl: r };
            } else {
                r = Object.assign({ tl: 0, tr: 0, br: 0, bl: 0 }, r);
            }
            this.beginPath();
            this.moveTo(x + r.tl, y);
            this.lineTo(x + w - r.tr, y);
            this.quadraticCurveTo(x + w, y, x + w, y + r.tr);
            this.lineTo(x + w, y + h - r.br);
            this.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
            this.lineTo(x + r.bl, y + h);
            this.quadraticCurveTo(x, y + h, x, y + h - r.bl);
            this.lineTo(x, y + r.tl);
            this.quadraticCurveTo(x, y, x + r.tl, y);
            this.closePath();
            return this;
        };
    }
}

setupRoundRectPolyfill();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}
