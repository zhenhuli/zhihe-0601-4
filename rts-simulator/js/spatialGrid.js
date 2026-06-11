export class SpatialGrid {
    constructor(width, height, cellSize) {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.cols = Math.ceil(width / cellSize);
        this.rows = Math.ceil(height / cellSize);
        this.grid = [];
        for (let i = 0; i < this.cols * this.rows; i++) {
            this.grid[i] = [];
        }
    }

    getCellIndex(x, y) {
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);
        return row * this.cols + col;
    }

    insert(obj) {
        const index = this.getCellIndex(obj.x, obj.y);
        if (index >= 0 && index < this.grid.length) {
            this.grid[index].push(obj);
            obj._gridIndex = index;
        }
    }

    remove(obj) {
        if (obj._gridIndex !== undefined && obj._gridIndex < this.grid.length) {
            const cell = this.grid[obj._gridIndex];
            const idx = cell.indexOf(obj);
            if (idx !== -1) {
                cell.splice(idx, 1);
            }
        }
    }

    update(obj) {
        this.remove(obj);
        this.insert(obj);
    }

    query(x, y, radius) {
        const results = [];
        const minCol = Math.max(0, Math.floor((x - radius) / this.cellSize));
        const maxCol = Math.min(this.cols - 1, Math.floor((x + radius) / this.cellSize));
        const minRow = Math.max(0, Math.floor((y - radius) / this.cellSize));
        const maxRow = Math.min(this.rows - 1, Math.floor((y + radius) / this.cellSize));

        for (let row = minRow; row <= maxRow; row++) {
            for (let col = minCol; col <= maxCol; col++) {
                const index = row * this.cols + col;
                const cell = this.grid[index];
                for (const obj of cell) {
                    const dx = obj.x - x;
                    const dy = obj.y - y;
                    if (dx * dx + dy * dy <= radius * radius) {
                        results.push(obj);
                    }
                }
            }
        }
        return results;
    }

    queryRect(x, y, w, h) {
        const results = [];
        const minCol = Math.max(0, Math.floor(x / this.cellSize));
        const maxCol = Math.min(this.cols - 1, Math.floor((x + w) / this.cellSize));
        const minRow = Math.max(0, Math.floor(y / this.cellSize));
        const maxRow = Math.min(this.rows - 1, Math.floor((y + h) / this.cellSize));

        for (let row = minRow; row <= maxRow; row++) {
            for (let col = minCol; col <= maxCol; col++) {
                const index = row * this.cols + col;
                const cell = this.grid[index];
                for (const obj of cell) {
                    if (obj.x >= x && obj.x <= x + w && obj.y >= y && obj.y <= y + h) {
                        results.push(obj);
                    }
                }
            }
        }
        return results;
    }

    clear() {
        for (let i = 0; i < this.grid.length; i++) {
            this.grid[i] = [];
        }
    }

    drawDebug(ctx) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let col = 0; col <= this.cols; col++) {
            ctx.beginPath();
            ctx.moveTo(col * this.cellSize, 0);
            ctx.lineTo(col * this.cellSize, this.height);
            ctx.stroke();
        }
        for (let row = 0; row <= this.rows; row++) {
            ctx.beginPath();
            ctx.moveTo(0, row * this.cellSize);
            ctx.lineTo(this.width, row * this.cellSize);
            ctx.stroke();
        }
    }
}
