// 添加错误捕获和调试信息
(function () {
    // 捕获全局错误
    window.onerror = function (message, source, lineno, colno, error) {
        console.error('全局错误:', message, source, lineno, colno);
        alert('游戏加载出错: ' + message);
        return true;
    };

    // 原始游戏代码开始
    class Game {
        constructor() {
            try {
                this.grid = Array(4).fill().map(() => Array(4).fill(null)); // Change: Store objects instead of numbers
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

                // 初始化主题
                this.initTheme();

                // 添加窗口大小变化监听
                window.addEventListener('resize', () => {
                    this.renderGrid();
                });
            } catch (e) {
                console.error('初始化游戏界面出错:', e);
            }
        }

        initTheme() {
            const themeBtn = document.getElementById('theme-toggle');
            if (themeBtn) {
                // 检查本地存储的主题偏好
                const savedTheme = localStorage.getItem('theme');
                if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                }

                // 绑定点击事件
                themeBtn.addEventListener('click', () => {
                    // 触发熄灯动画
                    document.body.classList.add('animating-theme');

                    setTimeout(() => {
                        const currentTheme = document.documentElement.getAttribute('data-theme');
                        if (currentTheme === 'dark') {
                            document.documentElement.removeAttribute('data-theme');
                            localStorage.setItem('theme', 'light');
                        } else {
                            document.documentElement.setAttribute('data-theme', 'dark');
                            localStorage.setItem('theme', 'dark');
                        }

                        // 动画结束后移除罩子
                        setTimeout(() => {
                            document.body.classList.remove('animating-theme');
                        }, 50); // 留出一点点渲染时间
                    }, 150); // 等待罩子变黑（对应CSS的0.2s的大部分时间）
                });
            }
        }

        addRandomTile() {
            const emptyCells = [];
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (this.grid[i][j] === null) {
                        emptyCells.push({ x: i, y: j });
                    }
                }
            }
            if (emptyCells.length > 0) {
                const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                this.grid[randomCell.x][randomCell.y] = {
                    value: Math.random() < 0.9 ? 2 : 4,
                    isNew: true,
                    isMerged: false
                };
            }
        }

        resetTileStates() {
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (this.grid[i][j]) {
                        this.grid[i][j].isNew = false;
                        this.grid[i][j].isMerged = false;
                    }
                }
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
                        const cellData = this.grid[i][j];
                        if (cellData !== null) {
                            const index = i * 4 + j;
                            if (!cellPositions[index]) {
                                console.error(`未找到单元格位置: ${index}`);
                                continue;
                            }

                            const position = cellPositions[index];
                            const tile = document.createElement('div');

                            let classes = `tile tile-${cellData.value}`;
                            if (cellData.isNew) classes += ' tile-new';
                            if (cellData.isMerged) classes += ' tile-merged';

                            tile.className = classes;
                            tile.textContent = cellData.value;

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

            this.resetTileStates();
            let moved = false;
            let currentGridStr = this.getGridStr();

            switch (direction) {
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
                    document.querySelector('.game-message p').textContent = window.i18nTranslate ? window.i18nTranslate('game_over') : '游戏结束！';

                    // Add conditional share button if not exists
                    if (!document.querySelector('.share-button')) {
                        const shareBtn = document.createElement('a');
                        shareBtn.className = 'retry-button share-button';
                        shareBtn.style.marginTop = '10px';
                        shareBtn.style.background = 'var(--btn-bg)';
                        shareBtn.textContent = window.i18nTranslate ? window.i18nTranslate('share') : 'Share';
                        shareBtn.addEventListener('click', () => this.shareScore());
                        document.querySelector('.lower').appendChild(shareBtn);
                    }
                }
            }
        }

        shareScore() {
            const textStr = window.i18nTranslate ? window.i18nTranslate('share_msg') : `I just scored ${this.score} in 1024!`;
            const shareText = textStr.replace('{score}', this.score);
            const shareUrl = window.location.href;

            if (navigator.share) {
                navigator.share({
                    title: '1024 Game',
                    text: shareText,
                    url: shareUrl
                }).catch(console.error);
            } else {
                // Fallback to Twitter/X
                const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
                window.open(twitterUrl, '_blank');
            }
        }


        getGridStr() {
            return JSON.stringify(this.grid.map(row => row.map(cell => cell ? cell.value : null)));
        }

        moveLeft() {
            let moved = false;
            let beforeStr = this.getGridStr();

            for (let i = 0; i < 4; i++) {
                let row = this.grid[i].filter(cell => cell !== null);
                for (let j = 0; j < row.length - 1; j++) {
                    if (row[j].value === row[j + 1].value) {
                        row[j] = { value: row[j].value * 2, isNew: false, isMerged: true };
                        this.score += row[j].value;
                        row.splice(j + 1, 1);
                    }
                }
                const newRow = row.concat(Array(4 - row.length).fill(null));
                this.grid[i] = newRow;
            }
            if (beforeStr !== this.getGridStr()) moved = true;
            return moved;
        }

        moveRight() {
            let moved = false;
            let beforeStr = this.getGridStr();

            for (let i = 0; i < 4; i++) {
                let row = this.grid[i].filter(cell => cell !== null);
                for (let j = row.length - 1; j > 0; j--) {
                    if (row[j].value === row[j - 1].value) {
                        row[j] = { value: row[j].value * 2, isNew: false, isMerged: true };
                        this.score += row[j].value;
                        row.splice(j - 1, 1);
                    }
                }
                const newRow = Array(4 - row.length).fill(null).concat(row);
                this.grid[i] = newRow;
            }
            if (beforeStr !== this.getGridStr()) moved = true;
            return moved;
        }

        moveUp() {
            let moved = false;
            let beforeStr = this.getGridStr();

            for (let j = 0; j < 4; j++) {
                let column = [];
                for (let i = 0; i < 4; i++) {
                    column.push(this.grid[i][j]);
                }
                column = column.filter(cell => cell !== null);
                for (let i = 0; i < column.length - 1; i++) {
                    if (column[i].value === column[i + 1].value) {
                        column[i] = { value: column[i].value * 2, isNew: false, isMerged: true };
                        this.score += column[i].value;
                        column.splice(i + 1, 1);
                    }
                }
                column = column.concat(Array(4 - column.length).fill(null));
                for (let i = 0; i < 4; i++) {
                    this.grid[i][j] = column[i];
                }
            }
            if (beforeStr !== this.getGridStr()) moved = true;
            return moved;
        }

        moveDown() {
            let moved = false;
            let beforeStr = this.getGridStr();

            for (let j = 0; j < 4; j++) {
                let column = [];
                for (let i = 0; i < 4; i++) {
                    column.push(this.grid[i][j]);
                }
                column = column.filter(cell => cell !== null);
                for (let i = column.length - 1; i > 0; i--) {
                    if (column[i].value === column[i - 1].value) {
                        column[i] = { value: column[i].value * 2, isNew: false, isMerged: true };
                        this.score += column[i].value;
                        column.splice(i - 1, 1);
                    }
                }
                column = Array(4 - column.length).fill(null).concat(column);
                for (let i = 0; i < 4; i++) {
                    this.grid[i][j] = column[i];
                }
            }
            if (beforeStr !== this.getGridStr()) moved = true;
            return moved;
        }

        updateScore() {
            document.getElementById('score').textContent = this.score;
            if (this.score > this.bestScore) {
                this.bestScore = this.score;
                localStorage.setItem('bestScore', this.bestScore);
            }
            document.getElementById('best-score').textContent = this.bestScore;
        }

        checkGameOver() {
            // 检查是否还有空格
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (this.grid[i][j] === null) return false;
                }
            }

            // 检查是否还有可以合并的相邻格子
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 3; j++) {
                    if (this.grid[i][j].value === this.grid[i][j + 1].value) return false;
                }
            }
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 4; j++) {
                    if (this.grid[i][j].value === this.grid[i + 1][j].value) return false;
                }
            }
            return true;
        }

        setupEventListeners() {
            // 键盘控制
            document.addEventListener('keydown', (e) => {
                switch (e.key) {
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
                    this.grid = Array(4).fill().map(() => Array(4).fill(null));
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
    document.addEventListener('DOMContentLoaded', () => {
        try {
            console.log('开始初始化游戏');
            new Game();
        } catch (e) {
            console.error('启动游戏失败:', e);
            alert('游戏启动失败: ' + e.message);
        }
    });
})(); 