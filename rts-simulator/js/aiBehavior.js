import { UNIT_STATE } from './unit.js';

export class AIBehavior {
    constructor(config = {}) {
        this.separationWeight = config.separationWeight || 1.5;
        this.alignmentWeight = config.alignmentWeight || 0.8;
        this.cohesionWeight = config.cohesionWeight || 1.0;
        this.separationRadius = config.separationRadius || 60;
        this.neighborRadius = config.neighborRadius || 120;
        this.maxSteerForce = 0.1;
    }

    update(unit, allUnits, dt, astar, obstacles) {
        if (!unit.active || unit.team !== 'enemy') return;
        if (unit.state === UNIT_STATE.ATTACKING) return;

        const neighbors = this.getNeighbors(unit, allUnits);
        if (neighbors.length === 0) return;

        const separation = this.separate(unit, neighbors);
        const alignment = this.align(unit, neighbors);
        const cohesion = this.cohere(unit, neighbors);

        separation.x *= this.separationWeight;
        separation.y *= this.separationWeight;
        alignment.x *= this.alignmentWeight;
        alignment.y *= this.alignmentWeight;
        cohesion.x *= this.cohesionWeight;
        cohesion.y *= this.cohesionWeight;

        let steering = {
            x: separation.x + alignment.x + cohesion.x,
            y: separation.y + alignment.y + cohesion.y
        };

        const len = Math.sqrt(steering.x * steering.x + steering.y * steering.y);
        if (len > this.maxSteerForce) {
            steering.x = (steering.x / len) * this.maxSteerForce;
            steering.y = (steering.y / len) * this.maxSteerForce;
        }

        if (unit.path.length === 0 && (!unit.targetPoint || this.getDistance(unit, unit.targetPoint) < 30)) {
            if (Math.random() < 0.02) {
                const wanderTarget = this.getWanderTarget(unit, neighbors);
                if (wanderTarget) {
                    unit.moveTo(wanderTarget.x, wanderTarget.y, astar, obstacles);
                }
            }
        }

        if (len > 0.01 && unit.path.length === 0) {
            const currentAngle = unit.angle;
            const targetAngle = Math.atan2(steering.y, steering.x);
            const smoothedAngle = this.smoothAngle(currentAngle, targetAngle, unit.turnSpeed * dt * 0.5);
            unit.angle = smoothedAngle;
        }
    }

    getNeighbors(unit, allUnits) {
        const neighbors = [];
        for (const other of allUnits) {
            if (other === unit || !other.active || other.team !== unit.team) continue;
            const dist = this.getDistance(unit, other);
            if (dist < this.neighborRadius) {
                neighbors.push(other);
            }
        }
        return neighbors;
    }

    separate(unit, neighbors) {
        let steer = { x: 0, y: 0 };
        let count = 0;

        for (const other of neighbors) {
            const dist = this.getDistance(unit, other);
            if (dist > 0 && dist < this.separationRadius) {
                const dx = unit.x - other.x;
                const dy = unit.y - other.y;
                const len = Math.sqrt(dx * dx + dy * dy);
                steer.x += (dx / len) / dist;
                steer.y += (dy / len) / dist;
                count++;
            }
        }

        if (count > 0) {
            steer.x /= count;
            steer.y /= count;
        }

        return steer;
    }

    align(unit, neighbors) {
        let sum = { x: 0, y: 0 };
        let count = 0;

        for (const other of neighbors) {
            if (other.state === UNIT_STATE.MOVING || other.state === UNIT_STATE.ATTACKING) {
                sum.x += Math.cos(other.angle);
                sum.y += Math.sin(other.angle);
                count++;
            }
        }

        if (count > 0) {
            sum.x /= count;
            sum.y /= count;
            const len = Math.sqrt(sum.x * sum.x + sum.y * sum.y);
            if (len > 0) {
                sum.x /= len;
                sum.y /= len;
            }
        }

        return sum;
    }

    cohere(unit, neighbors) {
        let sum = { x: 0, y: 0 };
        let count = 0;

        for (const other of neighbors) {
            sum.x += other.x;
            sum.y += other.y;
            count++;
        }

        if (count > 0) {
            sum.x /= count;
            sum.y /= count;
            return this.seek(unit, sum);
        }

        return { x: 0, y: 0 };
    }

    seek(unit, target) {
        const dx = target.x - unit.x;
        const dy = target.y - unit.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len > 0) {
            return { x: dx / len, y: dy / len };
        }
        return { x: 0, y: 0 };
    }

    getWanderTarget(unit, neighbors) {
        if (neighbors.length === 0) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 50 + Math.random() * 100;
            return {
                x: Math.max(50, Math.min(750, unit.x + Math.cos(angle) * dist)),
                y: Math.max(50, Math.min(550, unit.y + Math.sin(angle) * dist))
            };
        }

        let centerX = 0, centerY = 0;
        for (const n of neighbors) {
            centerX += n.x;
            centerY += n.y;
        }
        centerX /= neighbors.length;
        centerY /= neighbors.length;

        const angle = Math.random() * Math.PI * 2;
        const dist = 30 + Math.random() * 60;
        return {
            x: Math.max(50, Math.min(750, centerX + Math.cos(angle) * dist)),
            y: Math.max(50, Math.min(550, centerY + Math.sin(angle) * dist))
        };
    }

    getDistance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    smoothAngle(current, target, maxDelta) {
        let diff = target - current;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        if (diff > maxDelta) diff = maxDelta;
        if (diff < -maxDelta) diff = -maxDelta;
        return current + diff;
    }

    drawDebug(ctx, unit, allUnits) {
        if (!unit.active || unit.team !== 'enemy') return;

        ctx.strokeStyle = 'rgba(100, 100, 255, 0.2)';
        ctx.beginPath();
        ctx.arc(unit.x, unit.y, this.neighborRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255, 100, 100, 0.3)';
        ctx.beginPath();
        ctx.arc(unit.x, unit.y, this.separationRadius, 0, Math.PI * 2);
        ctx.stroke();

        const neighbors = this.getNeighbors(unit, allUnits);
        for (const n of neighbors) {
            ctx.strokeStyle = 'rgba(100, 255, 100, 0.3)';
            ctx.beginPath();
            ctx.moveTo(unit.x, unit.y);
            ctx.lineTo(n.x, n.y);
            ctx.stroke();
        }
    }
}
