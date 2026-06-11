import { Unit } from './unit.js';

export class InputHandler {
    constructor(canvas, gameState) {
        this.canvas = canvas;
        this.gameState = gameState;
        this.mouseX = 0;
        this.mouseY = 0;
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.dragEnd = { x: 0, y: 0 };
        this.justClicked = false;
        this.maxPlayerUnits = 10;

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    handleMouseMove(e) {
        const pos = this.getMousePos(e);
        this.mouseX = pos.x;
        this.mouseY = pos.y;

        if (this.isDragging) {
            this.dragEnd = pos;
        }
    }

    handleMouseDown(e) {
        const pos = this.getMousePos(e);

        if (e.button === 0) {
            if (this.isInMinimap(pos.x, pos.y)) {
                this.handleMinimapClick(pos);
                return;
            }

            const clickedUnit = this.getUnitAt(pos.x, pos.y);
            if (clickedUnit && clickedUnit.team === 'player') {
                this.selectUnit(clickedUnit, e.shiftKey);
                this.justClicked = true;
            } else if (clickedUnit && clickedUnit.team === 'enemy') {
                const selectedUnits = this.gameState.units.filter(u => u.selected && u.team === 'player' && u.active);
                if (selectedUnits.length > 0) {
                    for (const unit of selectedUnits) {
                        unit.attackTarget(clickedUnit);
                    }
                }
                this.justClicked = true;
            } else {
                this.isDragging = true;
                this.dragStart = pos;
                this.dragEnd = pos;
                this.justClicked = false;
                if (!e.shiftKey) {
                    this.deselectAll();
                }
            }
        } else if (e.button === 2) {
            e.preventDefault();
            this.handleRightClick(pos);
        }
    }

    handleMouseUp(e) {
        if (e.button === 0) {
            if (this.isDragging) {
                this.isDragging = false;
                const rect = this.getDragRect();
                if (rect.w > 5 || rect.h > 5) {
                    this.selectUnitsInRect(rect, e.shiftKey);
                } else if (!this.justClicked) {
                    const pos = this.getMousePos(e);
                    if (!this.isInMinimap(pos.x, pos.y)) {
                        this.tryCreatePlayerUnit(pos.x, pos.y);
                    }
                }
            }
            this.justClicked = false;
        }
    }

    handleRightClick(pos) {
        if (this.isInMinimap(pos.x, pos.y)) {
            this.handleMinimapRightClick(pos);
            return;
        }

        const selectedUnits = this.gameState.units.filter(u => u.selected && u.team === 'player' && u.active);
        if (selectedUnits.length === 0) return;

        const targetUnit = this.getUnitAt(pos.x, pos.y);
        if (targetUnit && targetUnit.team === 'enemy') {
            for (const unit of selectedUnits) {
                unit.attackTarget(targetUnit);
            }
            return;
        }

        if (selectedUnits.length === 1) {
            selectedUnits[0].moveTo(pos.x, pos.y, this.gameState.astar, this.gameState.obstacles);
        } else {
            this.moveGroup(selectedUnits, pos.x, pos.y);
        }
    }

    moveGroup(units, targetX, targetY) {
        const cols = Math.ceil(Math.sqrt(units.length));
        const spacing = 50;

        let centerX = 0, centerY = 0;
        for (const unit of units) {
            centerX += unit.x;
            centerY += unit.y;
        }
        centerX /= units.length;
        centerY /= units.length;

        const dx = targetX - centerX;
        const dy = targetY - centerY;

        units.forEach((unit, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const offsetX = (col - (cols - 1) / 2) * spacing;
            const offsetY = (row - (cols - 1) / 2) * spacing;

            const angle = Math.atan2(dy, dx);
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const rotatedX = offsetX * cos - offsetY * sin;
            const rotatedY = offsetX * sin + offsetY * cos;

            const unitTargetX = targetX + rotatedX;
            const unitTargetY = targetY + rotatedY;

            const clampedX = Math.max(30, Math.min(770, unitTargetX));
            const clampedY = Math.max(30, Math.min(570, unitTargetY));

            unit.moveTo(clampedX, clampedY, this.gameState.astar, this.gameState.obstacles);
        });
    }

    isInMinimap(x, y) {
        if (!this.gameState.minimapVisible) return false;
        const mm = this.gameState.minimap;
        return x >= mm.x && x <= mm.x + mm.w && y >= mm.y && y <= mm.y + mm.h;
    }

    handleMinimapClick(pos) {
        const mm = this.gameState.minimap;
        const worldX = (pos.x - mm.x) / mm.w * this.gameState.width;
        const worldY = (pos.y - mm.y) / mm.h * this.gameState.height;

        const clickedUnit = this.getUnitAt(worldX, worldY);
        if (clickedUnit && clickedUnit.team === 'player') {
            this.selectUnit(clickedUnit, false);
        }
    }

    handleMinimapRightClick(pos) {
        const mm = this.gameState.minimap;
        const worldX = (pos.x - mm.x) / mm.w * this.gameState.width;
        const worldY = (pos.y - mm.y) / mm.h * this.gameState.height;

        const selectedUnits = this.gameState.units.filter(u => u.selected && u.team === 'player' && u.active);
        if (selectedUnits.length === 0) return;

        if (selectedUnits.length === 1) {
            selectedUnits[0].moveTo(worldX, worldY, this.gameState.astar, this.gameState.obstacles);
        } else {
            this.moveGroup(selectedUnits, worldX, worldY);
        }
    }

    getUnitAt(x, y) {
        for (const unit of this.gameState.units) {
            if (!unit.active) continue;
            const dx = unit.x - x;
            const dy = unit.y - y;
            if (dx * dx + dy * dy <= unit.radius * unit.radius) {
                return unit;
            }
        }
        return null;
    }

    selectUnit(unit, additive) {
        if (!additive) {
            this.deselectAll();
        }
        unit.selected = true;
    }

    deselectAll() {
        for (const unit of this.gameState.units) {
            unit.selected = false;
        }
    }

    getDragRect() {
        const x = Math.min(this.dragStart.x, this.dragEnd.x);
        const y = Math.min(this.dragStart.y, this.dragEnd.y);
        const w = Math.abs(this.dragEnd.x - this.dragStart.x);
        const h = Math.abs(this.dragEnd.y - this.dragStart.y);
        return { x, y, w, h };
    }

    selectUnitsInRect(rect, additive) {
        if (!additive) {
            this.deselectAll();
        }

        const unitsInRect = this.gameState.spatialGrid.queryRect(rect.x, rect.y, rect.w, rect.h);
        for (const unit of unitsInRect) {
            if (unit.team === 'player' && unit.active) {
                unit.selected = true;
            }
        }
    }

    tryCreatePlayerUnit(x, y) {
        const playerUnits = this.gameState.units.filter(u => u.team === 'player' && u.active);
        if (playerUnits.length >= this.maxPlayerUnits) {
            return false;
        }

        if (this.isInMinimap(x, y)) {
            return false;
        }

        for (const obs of this.gameState.obstacles) {
            const closestX = Math.max(obs.x, Math.min(x, obs.x + obs.w));
            const closestY = Math.max(obs.y, Math.min(y, obs.y + obs.h));
            const dx = x - closestX;
            const dy = y - closestY;
            if (dx * dx + dy * dy < 400) {
                return false;
            }
        }

        const unit = new Unit(x, y, 'player');
        this.gameState.units.push(unit);
        this.gameState.spatialGrid.insert(unit);
        return true;
    }

    draw(ctx) {
        if (this.isDragging) {
            const rect = this.getDragRect();
            ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
            ctx.fillStyle = 'rgba(255, 255, 0, 0.1)';
            ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
            ctx.setLineDash([]);
        }

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.mouseX, this.mouseY, 3, 0, Math.PI * 2);
        ctx.stroke();
    }
}
