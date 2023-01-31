const Algorithms = Object.freeze({
  'A*': 'astar',
  'Dijkstra': 'dijkstra',
  'BFS': 'bfs'
});

const Cell = Object.freeze({
 'visited': -1,
 'empty': 0,
 'start': 1,
 'obstacle': 2,
 'end': 3,
 'path': 4,
});

const Heuristic = Object.freeze({
  'Manhattan': 0,
  'Euclidean': 1
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = exports = {Algorithms, Cell, Heuristic};
}