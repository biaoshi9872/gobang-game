const canvas = document.getElementById('chess-board');
const ctx = canvas.getContext('2d');
const restartBtn = document.getElementById('restart-btn');
const currentPlayerSpan = document.getElementById('current-player');

const boardSize = 15; // 15x15 的棋盘
const padding = 20;   // 棋盘边距
const cellSize = (canvas.width - padding * 2) / (boardSize - 1); // 每个格子的大小
const pieceRadius = cellSize * 0.4; // 棋子半径

let board = []; // 二维数组记录棋盘状态，0为空，1为黑，2为白
let isBlackTurn = true; // 是否黑子回合
let gameOver = false;

// 初始化游戏
function initGame() {
    board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
    isBlackTurn = true;
    gameOver = false;
    updateStatus();
    drawBoard();
}

// 绘制棋盘
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 画网格线
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;

    for (let i = 0; i < boardSize; i++) {
        // 横线
        ctx.moveTo(padding, padding + i * cellSize);
        ctx.lineTo(canvas.width - padding, padding + i * cellSize);
        // 竖线
        ctx.moveTo(padding + i * cellSize, padding);
        ctx.lineTo(padding + i * cellSize, canvas.height - padding);
    }
    ctx.stroke();

    // 画天元和星位
    const stars = [
        [3, 3], [11, 3], [3, 11], [11, 11], [7, 7]
    ];
    ctx.fillStyle = '#000';
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(padding + star[0] * cellSize, padding + star[1] * cellSize, 4, 0, 2 * Math.PI);
        ctx.fill();
    });

    // 重新绘制已有棋子
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j] !== 0) {
                drawPiece(i, j, board[i][j] === 1);
            }
        }
    }
}

// 绘制棋子
function drawPiece(x, y, isBlack) {
    const px = padding + x * cellSize;
    const py = padding + y * cellSize;
    
    ctx.beginPath();
    ctx.arc(px, py, pieceRadius, 0, 2 * Math.PI);
    
    // 添加一点渐变效果让棋子更立体
    const gradient = ctx.createRadialGradient(px - 2, py - 2, pieceRadius * 0.2, px, py, pieceRadius);
    if (isBlack) {
        gradient.addColorStop(0, '#666');
        gradient.addColorStop(1, '#000');
    } else {
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(1, '#d1d1d1');
    }
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // 给白棋加上细边框
    if (!isBlack) {
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

// 监听点击下棋
canvas.addEventListener('click', (e) => {
    if (gameOver) return;

    // 获取点击坐标
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 计算对应的棋盘交点索引
    const i = Math.round((x - padding) / cellSize);
    const j = Math.round((y - padding) / cellSize);

    // 边界检查和落子位置检查
    if (i >= 0 && i < boardSize && j >= 0 && j < boardSize && board[i][j] === 0) {
        // 落子
        board[i][j] = isBlackTurn ? 1 : 2;
        drawPiece(i, j, isBlackTurn);
        
        // 检查胜负
        if (checkWin(i, j)) {
            gameOver = true;
            setTimeout(() => {
                alert(isBlackTurn ? '黑棋获胜！' : '白棋获胜！');
            }, 100);
            return;
        }
        
        // 切换回合
        isBlackTurn = !isBlackTurn;
        updateStatus();
    }
});

// 更新状态文字
function updateStatus() {
    if (isBlackTurn) {
        currentPlayerSpan.className = 'black-piece-icon';
        currentPlayerSpan.textContent = '黑子';
    } else {
        currentPlayerSpan.className = 'white-piece-icon';
        currentPlayerSpan.textContent = '白子';
    }
}

// 检查是否获胜
function checkWin(x, y) {
    const target = board[x][y];
    
    // 四个方向：横、竖、左斜、右斜
    const dirs = [
        [[1, 0], [-1, 0]],   // 水平
        [[0, 1], [0, -1]],   // 垂直
        [[1, 1], [-1, -1]],  // 主对角线
        [[1, -1], [-1, 1]]   // 副对角线
    ];

    for (let i = 0; i < dirs.length; i++) {
        let count = 1; // 包含当前落子
        
        // 分别向两个相反方向检查
        for (let j = 0; j < 2; j++) {
            const dx = dirs[i][j][0];
            const dy = dirs[i][j][1];
            let currX = x + dx;
            let currY = y + dy;
            
            while (
                currX >= 0 && currX < boardSize && 
                currY >= 0 && currY < boardSize && 
                board[currX][currY] === target
            ) {
                count++;
                currX += dx;
                currY += dy;
            }
        }
        
        if (count >= 5) {
            return true;
        }
    }
    
    return false;
}

// 绑定重新开始按钮
restartBtn.addEventListener('click', initGame);

// 启动游戏
initGame();