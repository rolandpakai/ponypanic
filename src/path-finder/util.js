const { Cell } = require("./constants");

const isWalkable = (board, nodePosition) => {
  return board[nodePosition.y][nodePosition.x] !== Cell.obstacle;
};

const isOnBoard = (nodePosition, rowCount, colCount) => {
  return !(
    nodePosition.y > rowCount - 1 ||
    nodePosition.y < 0 ||
    nodePosition.x > colCount - 1 ||
    nodePosition.x < 0
  );
};

const isValidMove = (board, nodePosition, rowCount, colCount) => {
  return (
    isOnBoard(nodePosition, rowCount, colCount) &&
    isWalkable(board, nodePosition)
  );
};

const isValidDiagonal = (board, position, move) => {
  const { y } = position;

  const { x } = position;

  const dy = move[1];
  const dx = move[0];

  if (dx === -1) {
    // On LHS
    if (dy === -1) {
      // TOP LEFT
      return !(
        board[y][x - 1] === Cell.obstacle && board[y - 1][x] === Cell.obstacle
      );
    } // BOTTOM LEFT

    return (
      !board[y][x - 1] === Cell.obstacle && board[y + 1][x] === Cell.obstacle
    );
  } // On RHS

  if (dy === -1) {
    // TOP RIGHT
    return !(
      board[y - 1][x] === Cell.obstacle && board[y][x + 1] === Cell.obstacle
    );
  } // BOTTOM RIGHT

  return (
    !board[y + 1][x] === Cell.obstacle && board[y][x + 1] === Cell.obstacle
  );
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { isValidMove, isValidDiagonal };
}
