// Test script for Xiangqi logic
// Extracted from play.html

// Board initialization
function createInitialBoard() {
    return [
        ['B_C', 'B_M', 'B_X', 'B_S', 'B_K', 'B_S', 'B_X', 'B_M', 'B_C'],
        [null, null, null, null, null, null, null, null, null],
        [null, 'B_P', null, null, null, null, null, 'B_P', null],
        ['B_P', null, 'B_P', null, 'B_P', null, 'B_P', null, 'B_P'],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        ['R_P', null, 'R_P', null, 'R_P', null, 'R_P', null, 'R_P'],
        [null, 'R_P', null, null, null, null, null, 'R_P', null],
        [null, null, null, null, null, null, null, null, null],
        ['R_C', 'R_M', 'R_X', 'R_S', 'R_K', 'R_S', 'R_X', 'R_M', 'R_C']
    ];
}

// Piece types: R_ = Red, B_ = Black
// C = Chariot (Xe), M = Horse (Mã), X = Elephant (Tượng), S = Advisor (Sĩ), K = King (Tướng), P = Pawn (Tốt)

function isValidMove(piece, fromX, fromY, toX, toY, board) {
    if (fromX === toX && fromY === toY) return false;
    if (toX < 0 || toX > 8 || toY < 0 || toY > 9) return false;

    const dx = toX - fromX;
    const dy = toY - fromY;
    const color = piece.startsWith('R_') ? 'red' : 'black';

    switch (piece) {
        case 'R_K':
        case 'B_K':
            // King moves one step orthogonally within palace
            if (Math.abs(dx) + Math.abs(dy) !== 1) return false;
            if (color === 'red') {
                if (toX < 3 || toX > 5 || toY < 7 || toY > 9) return false;
            } else {
                if (toX < 3 || toX > 5 || toY < 0 || toY > 2) return false;
            }
            break;
        case 'R_S':
        case 'B_S':
            // Advisor moves diagonally one step within palace
            if (Math.abs(dx) !== 1 || Math.abs(dy) !== 1) return false;
            if (color === 'red') {
                if (toX < 3 || toX > 5 || toY < 7 || toY > 9) return false;
            } else {
                if (toX < 3 || toX > 5 || toY < 0 || toY > 2) return false;
            }
            break;
        case 'R_X':
        case 'B_X':
            // Elephant moves diagonally two steps, cannot cross river
            if (Math.abs(dx) !== 2 || Math.abs(dy) !== 2) return false;
            if (color === 'red' && toY < 5) return false;
            if (color === 'black' && toY > 4) return false;
            // Check blocking piece
            const blockX = fromX + dx / 2;
            const blockY = fromY + dy / 2;
            if (board[blockY][blockX]) return false;
            break;
        case 'R_M':
        case 'B_M':
            // Horse moves in L-shape
            if (!((Math.abs(dx) === 2 && Math.abs(dy) === 1) || (Math.abs(dx) === 1 && Math.abs(dy) === 2))) return false;
            // Check blocking piece
            let blockHorseX, blockHorseY;
            if (Math.abs(dx) === 2) {
                blockHorseX = fromX + dx / 2;
                blockHorseY = fromY;
            } else {
                blockHorseX = fromX;
                blockHorseY = fromY + dy / 2;
            }
            if (board[blockHorseY][blockHorseX]) return false;
            break;
        case 'R_C':
        case 'B_C':
            // Chariot moves orthogonally any distance
            if (dx !== 0 && dy !== 0) return false;
            // Check path is clear
            const stepX = dx === 0 ? 0 : dx > 0 ? 1 : -1;
            const stepY = dy === 0 ? 0 : dy > 0 ? 1 : -1;
            let x = fromX + stepX;
            let y = fromY + stepY;
            while (x !== toX || y !== toY) {
                if (board[y][x]) return false;
                x += stepX;
                y += stepY;
            }
            break;
        case 'R_P':
        case 'B_P':
            // Pawn moves forward one step, sideways after crossing river
            if (color === 'red') {
                if (fromY > 4) {
                    // Before river, only forward
                    if (dx !== 0 || dy !== -1) return false;
                } else {
                    // After river, forward or sideways
                    if ((Math.abs(dx) + Math.abs(dy) !== 1) || dy > 0) return false;
                }
            } else {
                if (fromY < 5) {
                    // Before river, only forward
                    if (dx !== 0 || dy !== 1) return false;
                } else {
                    // After river, forward or sideways
                    if ((Math.abs(dx) + Math.abs(dy) !== 1) || dy < 0) return false;
                }
            }
            break;
    }
    return true;
}

function isCheck(color, board) {
    let kingX = -1; let kingY = -1;
    const kingPiece = color === 'red' ? 'R_K' : 'B_K';
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 9; x++) {
            if (board[y][x] === kingPiece) { kingX = x; kingY = y; break; }
        }
        if (kingX !== -1) break;
    }
    if (kingX === -1) return false;

    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 9; x++) {
            const enemyPiece = board[y][x];
            if (enemyPiece && !enemyPiece.startsWith(color === 'red' ? 'R_' : 'B_')) {
                if (isValidMove(enemyPiece, x, y, kingX, kingY, board)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function isMoveLegal(piece, fromX, fromY, toX, toY, board) {
    const targetPiece = board[toY][toX];
    const isMyPiece = piece && ((piece.startsWith('R_') && piece.startsWith('R_')) || (piece.startsWith('B_') && piece.startsWith('B_')));
    const isMyTarget = targetPiece && ((targetPiece.startsWith('R_') && targetPiece.startsWith('R_')) || (targetPiece.startsWith('B_') && targetPiece.startsWith('B_')));
    if (isMyPiece && isMyTarget) return false;

    if (!isValidMove(piece, fromX, fromY, toX, toY, board)) return false;

    const tempBoard = JSON.parse(JSON.stringify(board));
    tempBoard[toY][toX] = piece;
    tempBoard[fromY][fromX] = null;

    const myColor = piece.startsWith('R_') ? 'red' : 'black';
    if (isCheck(myColor, tempBoard)) {
        return false;
    }

    return true;
}

function hasLegalMoves(color, board) {
    for (let fromY = 0; fromY < 10; fromY++) {
        for (let fromX = 0; fromX < 9; fromX++) {
            const piece = board[fromY][fromX];
            if (piece && piece.startsWith(color === 'red' ? 'R_' : 'B_')) {
                for (let toY = 0; toY < 10; toY++) {
                    for (let toX = 0; toX < 9; toX++) {
                        if (isMoveLegal(piece, fromX, fromY, toX, toY, board)) {
                            return true;
                        }
                    }
                }
            }
        }
    }
    return false;
}

// Test functions
function testCheckmate(board, color) {
    // Check if current player is in check and has no legal moves
    if (!isCheck(color, board)) return false;
    return !hasLegalMoves(color, board);
}

function testStalemate(board, color) {
    // Check if current player is not in check but has no legal moves
    if (isCheck(color, board)) return false;
    return !hasLegalMoves(color, board);
}

// Simulate a move
function makeMove(board, fromX, fromY, toX, toY) {
    const newBoard = JSON.parse(JSON.stringify(board));
    const piece = newBoard[fromY][fromX];
    newBoard[toY][toX] = piece;
    newBoard[fromY][fromX] = null;
    return newBoard;
}

// Print board for debugging
function printBoard(board) {
    for (let y = 0; y < 10; y++) {
        let row = '';
        for (let x = 0; x < 9; x++) {
            row += (board[y][x] || '---') + ' ';
        }
        console.log(row);
    }
    console.log('');
}

module.exports = {
    createInitialBoard,
    isValidMove,
    isCheck,
    isMoveLegal,
    hasLegalMoves,
    testCheckmate,
    testStalemate,
    makeMove,
    printBoard
};