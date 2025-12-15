// Başlangıç düğümünden BFS sırasını döner: [1, 2, 3, ...]

export function bfs(graph, startId) {
  const queue = [startId];
  const visited = new Set();
  const result = [];

  visited.add(startId);

  while (queue.length > 0) {
    const currentId = queue.shift();
    result.push(currentId);

    // Graph sınıfından komşuları al
    const neighbors = graph.getNeighbors(currentId);

    neighbors.forEach((neighborObj) => {
      const neighborId = neighborObj.node.id;
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        queue.push(neighborId);
      }
    });
  }

  return result; // Ziyaret sırasına göre düğüm ID'leri
}