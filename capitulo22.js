/////////PATHFINDING
function findRoute(graph, from, to) {
  let frontier = [{ place: from, path: [] }];
  let visited = new Set([from]);

  for (let i = 0; i < frontier.length; i++) {
    let { place, path } = frontier[i];
    for (let neighbor of graph[place]) {
      if (neighbor === to) return path.concat(neighbor);
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        frontier.push({ place: neighbor, path: path.concat(neighbor) });
      }
    }
  }
  return null;
}

let roadGraph = {
  Alice: ["Bob", "Claire"],
  Bob: ["Alice", "Diane"],
  Claire: ["Alice", "Diane"],
  Diane: ["Bob", "Claire", "Eve"],
  Eve: ["Diane"],
};
console.log(findRoute(roadGraph, "Alice", "Eve"));

/////////TIMING
function measureTime(label, callback) {
  let start = performance.now();
  let result = callback();
  let end = performance.now();
  console.log(`${label}: ${(end - start).toFixed(3)} ms`);
  return result;
}
measureTime("Loop 1M", () => {
  let total = 0;
  for (let i = 0; i < 1_000_000; i++) total += i;
  return total;
});

/////////OPTIMIZING
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

function buildUserGraph(users) {
  console.log("Generando grafo de usuarios...");
  return users.reduce((graph, user) => {
    graph[user.name] = user.skills || [];
    return graph;
  }, {});
}
const buildUserGraphCached = memoize(buildUserGraph);

const users = [
  { name: "Alice", skills: ["JS", "CSS"] },
  { name: "Bob", skills: ["Python", "Django"] },
];

console.log(buildUserGraphCached(users));
