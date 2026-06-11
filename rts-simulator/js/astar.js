class Node {
    constructor(x, y, walkable = true) {
        this.x = x;
        this.y = y;
        this.walkable = walkable;
        this.g = 0;
        this.h = 0;
        this.f = 0;
        this.parent = null;
    }
}

export class AStar {
    constructor(cols, rows, cellSize) {
        this.cols = cols;
        this.rows = rows;
        this.cellSize = cellSize;
        this.grid = [];
        for (let y = 0; y < rows; y++) {
            this.grid[y] = [];
            for (let x = 0; x < cols; x++) {
                this.grid[y][x] = new Node(x, y, true);
            }
        }
    }

    setObstacles(obstacles) {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                this.grid[y][x].walkable = true;
            }
        }

        for (const obs of obstacles) {
            const startCol = Math.max(0, Math.floor(obs.x / this.cellSize));
            const endCol = Math.min(this.cols - 1, Math.floor((obs.x + obs.w) / this.cellSize));
            const startRow = Math.max(0, Math.floor(obs.y / this.cellSize));
            const endRow = Math.min(this.rows - 1, Math.floor((obs.y + obs.h) / this.cellSize));

            for (let y = startRow; y <= endRow; y++) {
                for (let x = startCol; x <= endCol; x++) {
                    if (y >= 0 && y < this.rows && x >= 0 && x < this.cols) {
                        this.grid[y][x].walkable = false;
                    }
                }
            }
        }
    }

    heuristic(a, b) {
        const dx = Math.abs(a.x - b.x);
        const dy = Math.abs(a.y - b.y);
        return (dx + dy) + (Math.SQRT2 - 2) * Math.min(dx, dy);
    }

    getNeighbors(node) {
        const neighbors = [];
        const { x, y } = node;
        const dirs = [
            [0, -1], [1, 0], [0, 1], [-1, 0],
            [-1, -1], [1, -1], [1, 1], [-1, 1]
        ];

        for (const [dx, dy] of dirs) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                if (this.grid[ny][nx].walkable) {
                    if (dx !== 0 && dy !== 0) {
                        if (!this.grid[y][nx].walkable || !this.grid[ny][x].walkable) {
                            continue;
                        }
                    }
                    neighbors.push(this.grid[ny][nx]);
                }
            }
        }
        return neighbors;
    }

    findPath(startX, startY, endX, endY) {
        const startCol = Math.floor(startX / this.cellSize);
        const startRow = Math.floor(startY / this.cellSize);
        const endCol = Math.floor(endX / this.cellSize);
        const endRow = Math.floor(endY / this.cellSize);

        if (startCol < 0 || startCol >= this.cols || startRow < 0 || startRow >= this.rows) {
            return [];
        }
        if (endCol < 0 || endCol >= this.cols || endRow < 0 || endRow >= this.rows) {
            return [];
        }

        const startNode = this.grid[startRow][startCol];
        const endNode = this.grid[endRow][endCol];

        if (!endNode.walkable) {
            let found = false;
            for (let r = 1; r < 5 && !found; r++) {
                for (let dy = -r; dy <= r && !found; dy++) {
                    for (let dx = -r; dx <= r && !found; dx++) {
                        const nx = endCol + dx;
                        const ny = endRow + dy;
                        if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                            if (this.grid[ny][nx].walkable) {
                                endNode.x = nx;
                                endNode.y = ny;
                                endNode.walkable = true;
                                found = true;
                            }
                        }
                    }
                }
            }
            if (!found) return [];
        }

        const openSet = [];
        const closedSet = new Set();

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                this.grid[y][x].g = 0;
                this.grid[y][x].h = 0;
                this.grid[y][x].f = 0;
                this.grid[y][x].parent = null;
            }
        }

        openSet.push(startNode);

        while (openSet.length > 0) {
            let lowestIndex = 0;
            for (let i = 0; i < openSet.length; i++) {
                if (openSet[i].f < openSet[lowestIndex].f) {
                    lowestIndex = i;
                }
            }

            const current = openSet[lowestIndex];

            if (current.x === endNode.x && current.y === endNode.y) {
                const path = [];
                let node = current;
                while (node) {
                    path.unshift({
                        x: node.x * this.cellSize + this.cellSize / 2,
                        y: node.y * this.cellSize + this.cellSize / 2
                    });
                    node = node.parent;
                }
                return path;
            }

            openSet.splice(lowestIndex, 1);
            closedSet.add(`${current.x},${current.y}`);

            const neighbors = this.getNeighbors(current);
            for (const neighbor of neighbors) {
                if (closedSet.has(`${neighbor.x},${neighbor.y}`)) {
                    continue;
                }

                const dx = Math.abs(neighbor.x - current.x);
                const dy = Math.abs(neighbor.y - current.y);
                const cost = (dx !== 0 && dy !== 0) ? Math.SQRT2 : 1;
                const tentativeG = current.g + cost;

                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                } else if (tentativeG >= neighbor.g) {
                    continue;
                }

                neighbor.g = tentativeG;
                neighbor.h = this.heuristic(neighbor, endNode);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = current;
            }
        }

        return [];
    }

    drawDebug(ctx) {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const node = this.grid[y][x];
                if (!node.walkable) {
                    ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
                    ctx.fillRect(
                        x * this.cellSize,
                        y * this.cellSize,
                        this.cellSize,
                        this.cellSize
                    );
                }
            }
        }

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        for (let x = 0; x <= this.cols; x++) {
            ctx.beginPath();
            ctx.moveTo(x * this.cellSize, 0);
            ctx.lineTo(x * this.cellSize, this.rows * this.cellSize);
            ctx.stroke();
        }
        for (let y = 0; y <= this.rows; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * this.cellSize);
            ctx.lineTo(this.cols * this.cellSize, y * this.cellSize);
            ctx.stroke();
        }
    }
}
