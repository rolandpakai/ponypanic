const { Algorithms, Cell } = require("./constants");
const { isValidMove, isValidDiagonal } = require("./util");
const GraphNode = require("./GraphNode");

const aStar = (
  board,
  start,
  end,
  algorithm,
  heuristic,
  rowCount,
  colCount,
  allowDiagonalMoves
) => {
  const startNode = new GraphNode(algorithm, heuristic, null, start);
  const endNode = new GraphNode(algorithm, heuristic, null, end);

  let visitedNo = 5;
  let loopCount = 0;

  const maxLoopCount = (rowCount / 2) ** 10;

  const openList = [];
  const closedList = [];
  const visitedCells = [];

  openList.push(startNode);

  while (openList.length > 0 && loopCount < maxLoopCount) {
    loopCount += 1;

    // Find minimum cost node
    let currentNode = openList[0];
    let currentIndex = 0;

    for (let i = 0; i < openList.length; i += 1) {
      if (openList[i].f < currentNode.f) {
        currentNode = openList[i];
        currentIndex = i;
      }
    }

    // Remove it from open list and add it to closed list
    openList.splice(currentIndex, 1);
    closedList.push(currentNode);

    // If current node and end node is equal, then there is a path
    // Backtrace the path and return a position array
    if (currentNode.isEqual(endNode)) {
      const path = [];

      let tmp = currentNode;

      while (tmp != null) {
        path.push(tmp.position);
        tmp = tmp.parent;
      }

      return {
        path: path.reverse(),
        visited: visitedCells,
        totalVisitedNumber: visitedNo,
      };
    }

    const validNeighbors = [];

    const straightMoves = [
      { x: 0, y: -1, dir: "U" },
      { x: 0, y: 1, dir: "D" },
      { x: -1, y: 0, dir: "L" },
      { x: 1, y: 0, dir: "R" },
    ];

    const diagonalMoves = [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ];

    // Check every straight move. If it is a valid move, then create a node
    // and add the node to valid neighbors list.
    for (let i = 0; i < straightMoves.length; i += 1) {
      const move = straightMoves[i];
      const newNodePosition = {
        x: currentNode.position.x + move.x,
        y: currentNode.position.y + move.y,
        dir: move.dir,
      };

      if (isValidMove(board, newNodePosition, rowCount, colCount)) {
        const newNode = new GraphNode(
          algorithm,
          heuristic,
          currentNode,
          newNodePosition
        );

        newNode.updateValues(currentNode, endNode);
        validNeighbors.push(newNode);
      }
    }

    // Check every diagonal move. If it is a valid move, then create a node
    // and add the node to valid neighbors list.
    // Note: If diagonal allowed / not allowed option will be added to program,
    // this loop must be inside of a if block.
    if (allowDiagonalMoves) {
      for (let i = 0; i < diagonalMoves.length; i += 1) {
        const move = diagonalMoves[i];
        const newNodePosition = {
          x: currentNode.position.x + move[0],
          y: currentNode.position.y + move[1],
        };

        // First check borders, then check straight neighbors
        if (
          isValidMove(board, newNodePosition, rowCount, colCount) &&
          isValidDiagonal(board, currentNode.position, move)
        ) {
          const newNode = new GraphNode(
            algorithm,
            heuristic,
            currentNode,
            newNodePosition
          );

          newNode.updateValues(currentNode, endNode);
          validNeighbors.push(newNode);
        }
      }
    }

    for (let i = 0; i < validNeighbors.length; i += 1) {
      const neighbor = validNeighbors[i];
      if (!neighbor.isEqual(startNode) && !neighbor.isEqual(endNode)) {
        const { x } = neighbor.position;
        const { y } = neighbor.position;

        if (
          board[y][x] === Cell.empty &&
          !visitedCells.some((e) => e.x === x && e.y === y)
        ) {
          visitedCells.push({
            x: neighbor.position.x,
            y: neighbor.position.y,
            number: visitedNo,
          });

          visitedNo += 1;
        }
      }

      // If it is already visited, continue
      if (!closedList.some((e) => e.isEqual(neighbor))) {
        const isInOpenList = openList.some((e) => e.isEqual(neighbor));

        // If it is not in the open list, add it
        // If it is in the open list, then update the cost and path
        if (!isInOpenList) {
          openList.push(neighbor);
        } else {
          const index = openList.findIndex((e) => e.isEqual(neighbor));

          if (openList[index].f > neighbor.f) {
            openList[index] = neighbor;
          }
        }
      }
    }
  }

  // No path found
  return {
    path: null,
    visited: visitedCells,
    totalVisitedNumber: visitedNo,
  };
};

const dijkstra = (
  board,
  start,
  end,
  rowCount,
  colCount,
  allowDiagonalMoves
) => {
  return aStar(
    board,
    start,
    end,
    Algorithms.Dijkstra,
    null,
    rowCount,
    colCount,
    allowDiagonalMoves
  );
};

const bfs = (board, start, end, rowCount, colCount, allowDiagonalMoves) => {
  const startNode = new GraphNode(Algorithms.BFS, null, null, start);
  const endNode = new GraphNode(Algorithms.BFS, null, null, end);

  let visitedNo = 5;

  const openList = [];
  const closedList = [];
  const visitedCells = [];

  openList.push(startNode);

  while (openList.length > 0) {
    // Take the first item from the open list and add it to the closed list
    const currentNode = openList.shift();

    closedList.push(currentNode);

    // If current node and end node is equal, then there is a path
    // Backtrace the path and return a position array
    if (currentNode.isEqual(endNode)) {
      const path = [];

      let tmp = currentNode;

      while (tmp != null) {
        path.push(tmp.position);
        tmp = tmp.parent;
      }

      return {
        path: path.reverse(),
        visited: visitedCells,
        totalVisitedNumber: visitedNo,
      };
    }

    const validNeighbors = [];

    const straightMoves = [
      { x: 0, y: -1, dir: "U" },
      { x: 0, y: 1, dir: "D" },
      { x: -1, y: 0, dir: "L" },
      { x: 1, y: 0, dir: "R" },
    ];

    const diagonalMoves = [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ];

    // Check every straight move. If it is a valid move, then create a node
    // and add the node to valid neighbors list.
    for (let i = 0; i < straightMoves.length; i += 1) {
      const move = straightMoves[i];
      const newNodePosition = {
        x: currentNode.position.x + move.x,
        y: currentNode.position.y + move.y,
        dir: move.dir,
      };

      if (isValidMove(board, newNodePosition, rowCount, colCount)) {
        const newNode = new GraphNode(
          Algorithms.BFS,
          null,
          currentNode,
          newNodePosition
        );

        validNeighbors.push(newNode);
      }
    }

    // Check every diagonal move. If it is a valid move, then create a node
    // and add the node to valid neighbors list.
    // Note: If diagonal allowed / not allowed option will be added to program,
    // this loop must be inside of a if block.
    if (allowDiagonalMoves) {
      for (let i = 0; i < diagonalMoves.length; i += 1) {
        const move = diagonalMoves[i];
        const newNodePosition = {
          x: currentNode.position.x + move[0],
          y: currentNode.position.y + move[1],
        };

        // First check borders, then check straight neighbors
        if (
          isValidMove(board, newNodePosition, rowCount, colCount) &&
          isValidDiagonal(board, currentNode.position, move)
        ) {
          const newNode = new GraphNode(
            Algorithms.BFS,
            null,
            currentNode,
            newNodePosition
          );

          validNeighbors.push(newNode);
        }
      }
    }

    for (let i = 0; i < validNeighbors.length; i += 1) {
      const neighbor = validNeighbors[i];
      if (!neighbor.isEqual(startNode) && !neighbor.isEqual(endNode)) {
        const { x } = neighbor.position;
        const { y } = neighbor.position;

        if (
          board[y][x] === Cell.empty &&
          !visitedCells.some((e) => e.x === x && e.y === y)
        ) {
          visitedCells.push({
            x: neighbor.position.x,
            y: neighbor.position.y,
            number: visitedNo,
          });

          visitedNo += 1;
        }
      }

      // If it is already in closed list or open list, continue
      if (
        !closedList.some((e) => e.isEqual(neighbor)) &&
        !openList.some((e) => e.isEqual(neighbor))
      ) {
        neighbor.parent = currentNode;
        openList.push(neighbor);
      }
    }
  }

  // No path
  return {
    path: null,
    visited: visitedCells,
    totalVisitedNumber: visitedNo,
  };
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { aStar, dijkstra, bfs };
}
