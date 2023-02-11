// https://github.com/mertturkmenoglu/path-finding-algorithms
const { Algorithms } = require("./constants");
const { aStar, dijkstra, bfs } = require("./algorithms");

const PathFinder = (args) => {
  const {
    board,
    startNode,
    endNode,
    algorithm,
    heuristic,
    rowCount,
    colCount,
  } = args;

  let result = {};
  let path = [];

  switch (algorithm) {
    case Algorithms["A*"]:
      result = aStar(
        board,
        startNode,
        endNode,
        algorithm,
        heuristic,
        rowCount,
        colCount
      );

      break;
    case Algorithms.Dijkstra:
      result = dijkstra(board, startNode, endNode, rowCount, colCount);
      break;
    case Algorithms.BFS:
      result = bfs(board, startNode, endNode, rowCount, colCount);
      break;
    default:
      result = bfs(board, startNode, endNode, rowCount, colCount);
  }

  if (!(Object.keys(result).length === 0)) {
    path = result.path;
  }

  return path;
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = PathFinder;
}
