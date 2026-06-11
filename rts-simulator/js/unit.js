import { Projectile } from './projectile.js';

export const UNIT_STATE = {
    IDLE: 'idle',
    MOVING: 'moving',
    ATTACKING: 'attacking'
};

export class Unit {
    constructor(x, y, team, config = {}) {
        this.x = x;
        this.y = y;
        this.team = team;
        this.radius = config.radius || 18;
        this.speed = config.speed || 60;
        this.turnSpeed = config.turnSpeed || 2.5;
        this.maxHealth = config.maxHealth || 3;
        this.health = this.maxHealth;
        this.angle = Math.random() * Math.PI * 2;
        this.turretAngle = this.angle;
        this.active = true;
        this.selected = false;
        this.state = UNIT_STATE.IDLE;

        this.path = [];
        this.pathIndex = 0;
        this.targetPoint = null;
        this.targetUnit = null;

        this.fireRate = config.fireRate || 1;
        this.fireCooldown = 0;
        this.projectileSpeed = config.projectileSpeed || 250;
        this.projectileRange = config.projectileRange || 250;
        this.damage = config.damage || 1;
        this.detectionRange = config.detectionRange || 200;

        this.color = team === 'player' ? '#4a90e2' : '#e74c3c';
        this.colorDark = team === 'player' ? '#2c5aa0' : '#a93226';

        this.commandText = '';
        this.commandTimer = 0;
    }

    setCommand(text) {
        this.commandText = text;
        this.commandTimer = 1.5;
    }

    moveTo(targetX, targetY, astar, obstacles) {
        this.targetPoint = { x: targetX, y: targetY };
        this.path = astar.findPath(this.x, this.y, targetX, targetY);
        this.pathIndex = 0;
        this.state = UNIT_STATE.MOVING;
        this.targetUnit = null;
        this.setCommand('移动中...');
    }

    attackTarget(target) {
        this.targetUnit = target;
        this.state = UNIT_STATE.ATTACKING;
        this.path = [];
        this.setCommand('攻击中!');
    }

    stop() {
        this.path = [];
        this.targetPoint = null;
        this.targetUnit = null;
        this.state = UNIT_STATE.IDLE;
    }

    takeDamage(damage, particles, createExplosion) {
        this.health -= damage;
        if (this.health <= 0) {
            this.active = false;
            if (createExplosion) {
                createExplosion(this.x, this.y, particles, 25);
            }
        } else {
            if (createExplosion) {
                createExplosion(this.x, this.y, particles, 8);
            }
        }
    }

    update(dt, projectiles, spatialGrid, astar, obstacles, allUnits, particles, createExplosion) {
        if (!this.active) return;

        if (this.commandTimer > 0) {
            this.commandTimer -= dt;
        }

        if (this.fireCooldown > 0) {
            this.fireCooldown -= dt;
        }

        if (this.targetUnit && !this.targetUnit.active) {
            this.targetUnit = null;
            if (this.state === UNIT_STATE.ATTACKING) {
                this.state = UNIT_STATE.IDLE;
            }
        }

        if (!this.targetUnit) {
            this.findNearestEnemy(allUnits);
        }

        if (this.targetUnit && this.state === UNIT_STATE.IDLE) {
            const dist = this.getDistanceTo(this.targetUnit);
            if (dist <= this.detectionRange) {
                this.attackTarget(this.targetUnit);
            }
        }

        if (this.state === UNIT_STATE.ATTACKING && this.targetUnit) {
            this.handleAttacking(dt, projectiles, astar, obstacles);
        } else if (this.state === UNIT_STATE.MOVING || this.path.length > 0) {
            this.handleMoving(dt, obstacles, allUnits, projectiles);
        } else if (this.state === UNIT_STATE.ATTACKING && !this.targetUnit) {
            this.state = UNIT_STATE.IDLE;
        }
    }

    findNearestEnemy(allUnits) {
        let nearest = null;
        let nearestDist = Infinity;
        for (const unit of allUnits) {
            if (unit.active && unit.team !== this.team) {
                const dist = this.getDistanceTo(unit);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearest = unit;
                }
            }
        }
        if (nearest && nearestDist <= this.detectionRange * 1.5) {
            this.targetUnit = nearest;
        }
    }

    handleAttacking(dt, projectiles, astar, obstacles) {
        const target = this.targetUnit;
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const targetAngle = Math.atan2(dy, dx);
        const dist = Math.sqrt(dx * dx + dy * dy);

        this.turnTowards(targetAngle, dt);
        this.turretAngle = this.smoothAngle(this.turretAngle, targetAngle, this.turnSpeed * 1.5 * dt);

        if (dist <= this.projectileRange && this.fireCooldown <= 0) {
            const angleDiff = Math.abs(this.normalizeAngle(this.turretAngle - targetAngle));
            if (angleDiff < 0.2) {
                this.fire(projectiles);
            }
        }

        if (dist > this.projectileRange * 0.8 && astar) {
            this.moveTo(target.x, target.y, astar, obstacles);
        }
    }

    handleMoving(dt, obstacles, allUnits, projectiles) {
        this.tryFireAtNearbyEnemy(projectiles);

        if (this.path.length === 0) {
            if (this.targetPoint) {
                const dx = this.targetPoint.x - this.x;
                const dy = this.targetPoint.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > 5) {
                    this.turnTowards(Math.atan2(dy, dx), dt);
                    this.moveForward(dt, obstacles, allUnits);
                } else {
                    this.stop();
                }
            }
            return;
        }

        if (this.pathIndex >= this.path.length) {
            this.path = [];
            this.pathIndex = 0;
            if (this.targetUnit) {
                this.state = UNIT_STATE.ATTACKING;
            } else {
                this.state = UNIT_STATE.IDLE;
            }
            return;
        }

        const target = this.path[this.pathIndex];
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 10) {
            this.pathIndex++;
            return;
        }

        const targetAngle = Math.atan2(dy, dx);
        this.turnTowards(targetAngle, dt);

        const angleDiff = Math.abs(this.normalizeAngle(this.angle - targetAngle));
        if (angleDiff < 0.5) {
            this.moveForward(dt, obstacles, allUnits);
        }
    }

    tryFireAtNearbyEnemy(projectiles) {
        if (this.fireCooldown > 0) return;
        if (!this.targetUnit || !this.targetUnit.active) return;

        const dist = this.getDistanceTo(this.targetUnit);
        if (dist > this.projectileRange) return;

        const dx = this.targetUnit.x - this.x;
        const dy = this.targetUnit.y - this.y;
        const targetAngle = Math.atan2(dy, dx);

        this.turretAngle = this.smoothAngle(this.turretAngle, targetAngle, this.turnSpeed * 2 * (1 / 60));

        const angleDiff = Math.abs(this.normalizeAngle(this.turretAngle - targetAngle));
        if (angleDiff < 0.3) {
            this.fire(projectiles);
        }
    }

    turnTowards(targetAngle, dt) {
        this.angle = this.smoothAngle(this.angle, targetAngle, this.turnSpeed * dt);
    }

    smoothAngle(current, target, maxDelta) {
        let diff = this.normalizeAngle(target - current);
        if (diff > maxDelta) diff = maxDelta;
        if (diff < -maxDelta) diff = -maxDelta;
        return this.normalizeAngle(current + diff);
    }

    normalizeAngle(angle) {
        while (angle > Math.PI) angle -= Math.PI * 2;
        while (angle < -Math.PI) angle += Math.PI * 2;
        return angle;
    }

    moveForward(dt, obstacles, allUnits) {
        let newX = this.x + Math.cos(this.angle) * this.speed * dt;
        let newY = this.y + Math.sin(this.angle) * this.speed * dt;

        const margin = this.radius;
        if (newX < margin || newX > 800 - margin || newY < margin || newY > 600 - margin) {
            return;
        }

        if (obstacles) {
            for (const obs of obstacles) {
                if (this.checkRectCollision(newX, newY, this.radius, obs)) {
                    return;
                }
            }
        }

        if (allUnits) {
            for (const other of allUnits) {
                if (other === this || !other.active) continue;
                const dx = newX - other.x;
                const dy = newY - other.y;
                const distSq = dx * dx + dy * dy;
                const minDist = this.radius + other.radius + 2;
                if (distSq < minDist * minDist) {
                    if (distSq < 0.01) {
                        newX += (Math.random() - 0.5) * 2;
                        newY += (Math.random() - 0.5) * 2;
                    } else {
                        const dist = Math.sqrt(distSq);
                        const nx = dx / dist;
                        const ny = dy / dist;
                        const separationForce = this.speed * dt * 0.6;
                        newX = this.x + nx * separationForce;
                        newY = this.y + ny * separationForce;
                    }
                    break;
                }
            }
        }

        this.x = newX;
        this.y = newY;
    }

    checkRectCollision(cx, cy, r, rect) {
        const closestX = Math.max(rect.x, Math.min(cx, rect.x + rect.w));
        const closestY = Math.max(rect.y, Math.min(cy, rect.y + rect.h));
        const dx = cx - closestX;
        const dy = cy - closestY;
        return (dx * dx + dy * dy) < (r * r);
    }

    fire(projectiles) {
        if (this.fireCooldown > 0) return;
        const barrelX = this.x + Math.cos(this.turretAngle) * (this.radius + 5);
        const barrelY = this.y + Math.sin(this.turretAngle) * (this.radius + 5);
        const proj = new Projectile(
            barrelX, barrelY,
            this.turretAngle,
            this.projectileSpeed,
            this.projectileRange,
            this.damage,
            this
        );
        projectiles.push(proj);
        this.fireCooldown = 1 / this.fireRate;
    }

    getDistanceTo(other) {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    draw(ctx) {
        if (!this.active) return;

        ctx.save();
        ctx.translate(this.x, this.y);

        if (this.selected) {
            ctx.strokeStyle = '#ffff00';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(0, 0, this.radius + 5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        ctx.rotate(this.angle);
        ctx.fillStyle = this.colorDark;
        ctx.beginPath();
        ctx.roundRect(-this.radius * 0.8, -this.radius * 0.6, this.radius * 1.6, this.radius * 1.2, 4);
        ctx.fill();

        ctx.fillStyle = '#333';
        ctx.fillRect(-this.radius * 0.9, -this.radius * 0.7, this.radius * 1.8, 5);
        ctx.fillRect(-this.radius * 0.9, this.radius * 0.7 - 5, this.radius * 1.8, 5);

        ctx.rotate(-this.angle);
        ctx.rotate(this.turretAngle);

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 0.45, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = this.colorDark;
        ctx.fillRect(0, -3, this.radius * 0.9, 6);

        ctx.restore();

        this.drawHealthBar(ctx);
        this.drawCommandText(ctx);
    }

    drawHealthBar(ctx) {
        const barWidth = this.radius * 2;
        const barHeight = 4;
        const x = this.x - barWidth / 2;
        const y = this.y - this.radius - 12;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(x - 1, y - 1, barWidth + 2, barHeight + 2);

        ctx.fillStyle = '#333';
        ctx.fillRect(x, y, barWidth, barHeight);

        const healthPercent = this.health / this.maxHealth;
        const healthColor = healthPercent > 0.6 ? '#2ecc71' : healthPercent > 0.3 ? '#f39c12' : '#e74c3c';
        ctx.fillStyle = healthColor;
        ctx.fillRect(x, y, barWidth * healthPercent, barHeight);
    }

    drawCommandText(ctx) {
        if (this.commandTimer <= 0 || !this.commandText) return;

        ctx.save();
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillText(this.commandText, this.x + 1, this.y - this.radius - 16 + 1);
        ctx.fillStyle = '#fff';
        ctx.fillText(this.commandText, this.x, this.y - this.radius - 16);
        ctx.restore();
    }

    drawDebug(ctx) {
        if (!this.active) return;

        ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();

        if (this.path.length > 0) {
            ctx.strokeStyle = 'rgba(255, 255, 0, 0.6)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            for (let i = this.pathIndex; i < this.path.length; i++) {
                ctx.lineTo(this.path[i].x, this.path[i].y);
            }
            ctx.stroke();

            for (let i = this.pathIndex; i < this.path.length; i++) {
                ctx.fillStyle = i === this.pathIndex ? '#00ff00' : '#ffff00';
                ctx.beginPath();
                ctx.arc(this.path[i].x, this.path[i].y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        if (this.targetUnit && this.targetUnit.active) {
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.targetUnit.x, this.targetUnit.y);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        ctx.strokeStyle = 'rgba(255, 100, 100, 0.2)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.detectionRange, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(100, 255, 100, 0.2)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.projectileRange, 0, Math.PI * 2);
        ctx.stroke();
    }
}
