import { createExplosion } from './projectile.js';
import { Unit } from './unit.js';

export class GameLoop {
    constructor(canvas, gameState) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gameState = gameState;
        this.lastTime = 0;
        this.running = false;
        this.fps = 0;
        this.fpsCount = 0;
        this.fpsLastUpdate = 0;
    }

    start() {
        this.running = true;
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.loop(time));
    }

    stop() {
        this.running = false;
    }

    loop(currentTime) {
        if (!this.running) return;

        const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
        this.lastTime = currentTime;

        this.updateFPS(dt);
        this.update(dt);
        this.render();

        requestAnimationFrame((time) => this.loop(time));
    }

    updateFPS(dt) {
        this.fpsCount++;
        this.fpsLastUpdate += dt;
        if (this.fpsLastUpdate >= 1) {
            this.fps = this.fpsCount;
            this.fpsCount = 0;
            this.fpsLastUpdate = 0;
            const fpsElement = document.getElementById('fps');
            if (fpsElement) {
                fpsElement.textContent = `FPS: ${this.fps}`;
            }
        }
    }

    update(dt) {
        const gs = this.gameState;

        for (const unit of gs.units) {
            if (unit.active) {
                unit.update(
                    dt,
                    gs.projectiles,
                    gs.spatialGrid,
                    gs.astar,
                    gs.obstacles,
                    gs.units,
                    gs.particles,
                    createExplosion
                );
                gs.spatialGrid.update(unit);
            }
        }

        for (const unit of gs.units) {
            if (unit.active && unit.team === 'enemy') {
                gs.aiBehavior.update(unit, gs.units, dt, gs.astar, gs.obstacles);
            }
        }

        this.resolveUnitCollisions();

        for (const proj of gs.projectiles) {
            proj.update(dt);
            if (proj.active) {
                const nearbyUnits = gs.spatialGrid.query(proj.x, proj.y, 50);
                for (const unit of nearbyUnits) {
                    if (proj.checkCollision(unit)) {
                        unit.takeDamage(proj.damage, gs.particles, createExplosion);
                        proj.active = false;
                        break;
                    }
                }
            }
        }

        gs.projectiles = gs.projectiles.filter(p => p.active);
        gs.units = gs.units.filter(u => u.active);

        for (const particle of gs.particles) {
            particle.update(dt);
        }
        gs.particles = gs.particles.filter(p => p.active);

        this.respawnEnemies();
        this.updateUnitCountUI();
    }

    resolveUnitCollisions() {
        const gs = this.gameState;
        const activeUnits = gs.units.filter(u => u.active);
        const iterations = 3;

        for (let iter = 0; iter < iterations; iter++) {
            for (let i = 0; i < activeUnits.length; i++) {
                const a = activeUnits[i];
                for (let j = i + 1; j < activeUnits.length; j++) {
                    const b = activeUnits[j];
                    const dx = b.x - a.x;
                    const dy = b.y - a.y;
                    const distSq = dx * dx + dy * dy;
                    const minDist = a.radius + b.radius + 2;

                    if (distSq < minDist * minDist && distSq > 0.01) {
                        const dist = Math.sqrt(distSq);
                        const overlap = minDist - dist;
                        const nx = dx / dist;
                        const ny = dy / dist;
                        const pushX = nx * overlap * 0.5;
                        const pushY = ny * overlap * 0.5;

                        a.x -= pushX;
                        a.y -= pushY;
                        b.x += pushX;
                        b.y += pushY;

                        const margin = 5;
                        a.x = Math.max(a.radius + margin, Math.min(800 - a.radius - margin, a.x));
                        a.y = Math.max(a.radius + margin, Math.min(600 - a.radius - margin, a.y));
                        b.x = Math.max(b.radius + margin, Math.min(800 - b.radius - margin, b.x));
                        b.y = Math.max(b.radius + margin, Math.min(600 - b.radius - margin, b.y));

                        for (const obs of gs.obstacles) {
                            this.pushOutOfObstacle(a, obs);
                            this.pushOutOfObstacle(b, obs);
                        }
                    }
                }
            }
        }

        for (const unit of activeUnits) {
            gs.spatialGrid.update(unit);
        }
    }

    pushOutOfObstacle(unit, obs) {
        const closestX = Math.max(obs.x, Math.min(unit.x, obs.x + obs.w));
        const closestY = Math.max(obs.y, Math.min(unit.y, obs.y + obs.h));
        const dx = unit.x - closestX;
        const dy = unit.y - closestY;
        const distSq = dx * dx + dy * dy;

        if (distSq < unit.radius * unit.radius && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const nx = dx / dist;
            const ny = dy / dist;
            const push = unit.radius - dist + 1;
            unit.x += nx * push;
            unit.y += ny * push;
        } else if (distSq === 0) {
            const cx = obs.x + obs.w / 2;
            const cy = obs.y + obs.h / 2;
            const toDx = unit.x - cx;
            const toDy = unit.y - cy;
            const toDist = Math.sqrt(toDx * toDx + toDy * toDy);
            if (toDist > 0.01) {
                unit.x += (toDx / toDist) * (unit.radius + 5);
                unit.y += (toDy / toDist) * (unit.radius + 5);
            } else {
                unit.y -= unit.radius + obs.h / 2 + 5;
            }
        }
    }

    respawnEnemies() {
        const gs = this.gameState;
        const enemyCount = gs.units.filter(u => u.team === 'enemy' && u.active).length;
        
        if (enemyCount < 3 && Math.random() < 0.005) {
            const spawnPoints = [
                { x: 700, y: 100 },
                { x: 700, y: 300 },
                { x: 700, y: 500 }
            ];
            const spawn = spawnPoints[Math.floor(Math.random() * spawnPoints.length)];
            
            const enemy = new Unit(spawn.x, spawn.y, 'enemy', {
                speed: 55,
                detectionRange: 220
            });
            gs.units.push(enemy);
            gs.spatialGrid.insert(enemy);
        }
    }

    updateUnitCountUI() {
        const gs = this.gameState;
        const playerCount = gs.units.filter(u => u.team === 'player' && u.active).length;
        const enemyCount = gs.units.filter(u => u.team === 'enemy' && u.active).length;
        const element = document.getElementById('unitCount');
        if (element) {
            element.textContent = `🔵 玩家: ${playerCount}/10 | 🔴 敌方: ${enemyCount}`;
        }
    }

    render() {
        const ctx = this.ctx;
        const gs = this.gameState;

        ctx.fillStyle = '#2d4a3e';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawGround(ctx);

        if (gs.debugMode) {
            gs.spatialGrid.drawDebug(ctx);
            gs.astar.drawDebug(ctx);
        }

        this.drawObstacles(ctx);

        for (const unit of gs.units) {
            unit.draw(ctx);
            if (gs.debugMode) {
                unit.drawDebug(ctx);
                if (unit.team === 'enemy') {
                    gs.aiBehavior.drawDebug(ctx, unit, gs.units);
                }
            }
        }

        for (const proj of gs.projectiles) {
            proj.draw(ctx);
            if (gs.debugMode) {
                proj.drawDebug(ctx);
            }
        }

        for (const particle of gs.particles) {
            particle.draw(ctx);
        }

        if (gs.minimapVisible) {
            this.drawMinimap(ctx);
        }

        gs.inputHandler.draw(ctx);
    }

    drawGround(ctx) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;
        for (let x = 0; x < 800; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 600);
            ctx.stroke();
        }
        for (let y = 0; y < 600; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(800, y);
            ctx.stroke();
        }
    }

    drawObstacles(ctx) {
        const gs = this.gameState;
        for (const obs of gs.obstacles) {
            const gradient = ctx.createLinearGradient(obs.x, obs.y, obs.x + obs.w, obs.y + obs.h);
            gradient.addColorStop(0, '#5a5a5a');
            gradient.addColorStop(0.5, '#7a7a7a');
            gradient.addColorStop(1, '#4a4a4a');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.roundRect(obs.x, obs.y, obs.w, obs.h, 5);
            ctx.fill();

            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(obs.x + 3, obs.y + obs.h - 5, obs.w, 5);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(obs.x + 5, obs.y + 5, obs.w * 0.3, 3);

            if (gs.debugMode) {
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
                ctx.lineWidth = 2;
                ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);
            }
        }
    }

    drawMinimap(ctx) {
        const gs = this.gameState;
        const mm = gs.minimap;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(mm.x, mm.y, mm.w, mm.h);

        ctx.strokeStyle = '#4a4a6a';
        ctx.lineWidth = 2;
        ctx.strokeRect(mm.x, mm.y, mm.w, mm.h);

        const scaleX = mm.w / gs.width;
        const scaleY = mm.h / gs.height;

        ctx.fillStyle = '#5a5a5a';
        for (const obs of gs.obstacles) {
            ctx.fillRect(
                mm.x + obs.x * scaleX,
                mm.y + obs.y * scaleY,
                obs.w * scaleX,
                obs.h * scaleY
            );
        }

        for (const unit of gs.units) {
            if (!unit.active) continue;
            const px = mm.x + unit.x * scaleX;
            const py = mm.y + unit.y * scaleY;
            ctx.fillStyle = unit.team === 'player' ? '#4a90e2' : '#e74c3c';
            ctx.beginPath();
            ctx.arc(px, py, unit.selected ? 4 : 3, 0, Math.PI * 2);
            ctx.fill();

            if (unit.selected) {
                ctx.strokeStyle = '#ffff00';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '10px Arial';
        ctx.fillText('小地图', mm.x + 5, mm.y + 15);
    }
}
