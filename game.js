// 添加错误捕获和调试信息
(function() {
    // 捕获全局错误
    window.onerror = function(message, source, lineno, colno, error) {
        console.error('全局错误:', message, source, lineno, colno);
        alert('游戏加载出错: ' + message);
        return true;
    };
    
    // 原始游戏代码开始
    class Game {
        constructor() {
            try {
                this.grid = Array(4).fill().map(() => Array(4).fill(0));
                this.score = 0;
                this.bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
                this.gameOver = false;
                this.init();
                console.log('游戏初始化完成');
            } catch (e) {
                console.error('初始化游戏出错:', e);
            }
        }

        init() {
            try {
                // 初始化游戏界面
                this.updateScore();
                this.addRandomTile();
                this.addRandomTile();
                this.setupEventListeners();
                this.renderGrid();
                
                // 添加窗口大小变化监听
                window.addEventListener('resize', () => {
                    this.renderGrid();
                });
            } catch (e) {
                console.error('初始化游戏界面出错:', e);
            }
        }

        addRandomTile() {
            const emptyCells = [];
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (this.grid[i][j] === 0) {
                        emptyCells.push({x: i, y: j});
                    }
                }
            }
            if (emptyCells.length > 0) {
                const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                this.grid[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
            }
        }

        renderGrid() {
            try {
                const container = document.querySelector('.tile-container');
                if (!container) {
                    console.error('未找到.tile-container元素');
                    return;
                }
                
                container.innerHTML = '';
                
                // 直接获取网格单元格位置和尺寸
                const gridCells = document.querySelectorAll('.grid-cell');
                if (!gridCells || gridCells.length === 0) {
                    console.error('未找到.grid-cell元素');
                    return;
                }
                
                const cellPositions = [];
                
                // 获取每个单元格的位置和尺寸
                gridCells.forEach((cell, index) => {
                    const rect = cell.getBoundingClientRect();
                    const containerRect = container.getBoundingClientRect();
                    
                    // 计算相对于tile-container的位置
                    cellPositions.push({
                        left: rect.left - containerRect.left,
                        top: rect.top - containerRect.top,
                        width: rect.width,
                        height: rect.height
                    });
                });
                
                // 渲染方块
                for (let i = 0; i < 4; i++) {
                    for (let j = 0; j < 4; j++) {
                        if (this.grid[i][j] !== 0) {
                            const index = i * 4 + j;
                            if (!cellPositions[index]) {
                                console.error(`未找到单元格位置: ${index}`);
                                continue;
                            }
                            
                            const position = cellPositions[index];
                            
                            const tile = document.createElement('div');
                            tile.className = `tile tile-${this.grid[i][j]}`;
                            tile.textContent = this.grid[i][j];
                            
                            // 使用精确计算的位置
                            tile.style.width = `${position.width}px`;
                            tile.style.height = `${position.height}px`;
                            tile.style.top = `${position.top}px`;
                            tile.style.left = `${position.left}px`;
                            
                            container.appendChild(tile);
                        }
                    }
                }
            } catch (e) {
                console.error('渲染网格出错:', e);
            }
        }

        move(direction) {
            if (this.gameOver) return;

            const previousGrid = JSON.stringify(this.grid);
            let moved = false;

            switch(direction) {
                case 'up':
                    moved = this.moveUp();
                    break;
                case 'down':
                    moved = this.moveDown();
                    break;
                case 'left':
                    moved = this.moveLeft();
                    break;
                case 'right':
                    moved = this.moveRight();
                    break;
            }

            if (moved) {
                this.addRandomTile();
                this.renderGrid();
                this.updateScore();
                
                if (this.checkGameOver()) {
                    this.gameOver = true;
                    document.querySelector('.game-message').classList.add('game-over');
                    document.querySelector('.game-message p').textContent = '游戏结束！';
                }
            }
        }

        moveLeft() {
            let moved = false;
            for (let i = 0; i < 4; i++) {
                let row = this.grid[i].filter(cell => cell !== 0);
                for (let j = 0; j < row.length - 1; j++) {
                    if (row[j] === row[j + 1]) {
                        row[j] *= 2;
                        this.score += row[j];
                        row.splice(j + 1, 1);
                        moved = true;
                    }
                }
                const newRow = row.concat(Array(4 - row.length).fill(0));
                if (JSON.stringify(this.grid[i]) !== JSON.stringify(newRow)) {
                    moved = true;
                }
                this.grid[i] = newRow;
            }
            return moved;
        }

        moveRight() {
            let moved = false;
            for (let i = 0; i < 4; i++) {
                let row = this.grid[i].filter(cell => cell !== 0);
                for (let j = row.length - 1; j > 0; j--) {
                    if (row[j] === row[j - 1]) {
                        row[j] *= 2;
                        this.score += row[j];
                        row.splice(j - 1, 1);
                        moved = true;
                    }
                }
                const newRow = Array(4 - row.length).fill(0).concat(row);
                if (JSON.stringify(this.grid[i]) !== JSON.stringify(newRow)) {
                    moved = true;
                }
                this.grid[i] = newRow;
            }
            return moved;
        }

        moveUp() {
            let moved = false;
            for (let j = 0; j < 4; j++) {
                let column = [];
                for (let i = 0; i < 4; i++) {
                    column.push(this.grid[i][j]);
                }
                column = column.filter(cell => cell !== 0);
                for (let i = 0; i < column.length - 1; i++) {
                    if (column[i] === column[i + 1]) {
                        column[i] *= 2;
                        this.score += column[i];
                        column.splice(i + 1, 1);
                        moved = true;
                    }
                }
                column = column.concat(Array(4 - column.length).fill(0));
                for (let i = 0; i < 4; i++) {
                    if (this.grid[i][j] !== column[i]) {
                        moved = true;
                    }
                    this.grid[i][j] = column[i];
                }
            }
            return moved;
        }

        moveDown() {
            let moved = false;
            for (let j = 0; j < 4; j++) {
                let column = [];
                for (let i = 0; i < 4; i++) {
                    column.push(this.grid[i][j]);
                }
                column = column.filter(cell => cell !== 0);
                for (let i = column.length - 1; i > 0; i--) {
                    if (column[i] === column[i - 1]) {
                        column[i] *= 2;
                        this.score += column[i];
                        column.splice(i - 1, 1);
                        moved = true;
                    }
                }
                column = Array(4 - column.length).fill(0).concat(column);
                for (let i = 0; i < 4; i++) {
                    if (this.grid[i][j] !== column[i]) {
                        moved = true;
                    }
                    this.grid[i][j] = column[i];
                }
            }
            return moved;
        }

        updateScore() {
            document.getElementById('score').textContent = this.score;
            if (this.score > this.bestScore) {
                this.bestScore = this.score;
                localStorage.setItem('bestScore', this.bestScore);
                document.getElementById('best-score').textContent = this.bestScore;
            }
        }

        checkGameOver() {
            // 检查是否还有空格
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (this.grid[i][j] === 0) return false;
                }
            }

            // 检查是否还有可以合并的相邻格子
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 3; j++) {
                    if (this.grid[i][j] === this.grid[i][j + 1]) return false;
                }
            }
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 4; j++) {
                    if (this.grid[i][j] === this.grid[i + 1][j]) return false;
                }
            }
            return true;
        }

        setupEventListeners() {
            // 键盘控制
            document.addEventListener('keydown', (e) => {
                switch(e.key) {
                    case 'ArrowUp':
                        e.preventDefault();
                        this.move('up');
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        this.move('down');
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.move('left');
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.move('right');
                        break;
                }
            });

            // 触摸控制
            let touchStartX, touchStartY;
            document.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            });

            document.addEventListener('touchend', (e) => {
                if (!touchStartX || !touchStartY) return;

                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;

                const deltaX = touchEndX - touchStartX;
                const deltaY = touchEndY - touchStartY;

                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    if (deltaX > 0) {
                        this.move('right');
                    } else {
                        this.move('left');
                    }
                } else {
                    if (deltaY > 0) {
                        this.move('down');
                    } else {
                        this.move('up');
                    }
                }
            });

            // 重新开始按钮
            const retryButton = document.querySelector('.retry-button');
            if (retryButton) {
                retryButton.addEventListener('click', () => {
                    this.grid = Array(4).fill().map(() => Array(4).fill(0));
                    this.score = 0;
                    this.gameOver = false;
                    document.querySelector('.game-message').classList.remove('game-over');
                    this.init();
                });
            } else {
                console.error('未找到.retry-button元素');
            }
        }
    }

    // 启动游戏
    window.onload = () => {
        try {
            console.log('开始初始化游戏');
            new Game();
        } catch (e) {
            console.error('启动游戏失败:', e);
            alert('游戏启动失败: ' + e.message);
        }
    };
})(); 