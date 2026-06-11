export class Projectile {
    constructor(x, y, angle, speed, range, damage, owner) {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.angle = angle;
        this.speed = speed;
        this.range = range;
        this.damage = damage;
        this.owner = owner;
        this.radius = 4;
        this.active = true;
        this.trail = [];
        this.maxTrailLength = 8;
    }

    update(dt) {
        if (!this.active) return;

        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }

        this.x += Math.cos(this.angle) * this.speed * dt;
        this.y += Math.sin(this.angle) * this.speed * dt;

        const dx = this.x - this.startX;
        const dy = this.y - this.startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance >= this.range) {
            this.active = false;
        }

        if (this.x < 0 || this.x > 800 || this.y < 0 || this.y > 600) {
            this.active = false;
        }
    }

    checkCollision(target) {
        if (!this.active || target === this.owner || !target.active) return false;
        const dx = this.x - target.x;
        const dy = this.y - target.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.radius + target.radius;
    }

    draw(ctx) {
        if (!this.active) return;

        for (let i = 0; i < this.trail.length; i++) {
            const alpha = (i / this.trail.length) * 0.5;
            const size = (i / this.trail.length) * this.radius;
            ctx.fillStyle = `rgba(255, 200, 50, ${alpha})`;
            ctx.beginPath();
            ctx.arc(this.trail[i].x, this.trail[i].y, size, 0, Math.PI * 2);
            ctx.fill();
        }

        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius * 2
        );
        gradient.addColorStop(0, '#ffff88');
        gradient.addColorStop(0.5, '#ffcc00');
        gradient.addColorStop(1, 'rgba(255, 150, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    drawDebug(ctx) {
        if (!this.active) return;
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
    }
}

export class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 300;
        this.vy = (Math.random() - 0.5) * 300;
        this.life = 1;
        this.maxLife = 1;
        this.radius = Math.random() * 4 + 2;
        this.color = color;
        this.active = true;
    }

    update(dt) {
        if (!this.active) return;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.life -= dt * 2;
        if (this.life <= 0) {
            this.active = false;
        }
    }

    draw(ctx) {
        if (!this.active) return;
        const alpha = this.life / this.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * alpha, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

export function createExplosion(x, y, particles, count = 15) {
    const colors = ['#ff4444', '#ff8844', '#ffcc44', '#ffff44', '#ffffff'];
    for (let i = 0; i < count; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(x, y, color));
    }
}
