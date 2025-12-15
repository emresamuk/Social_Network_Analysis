// Başlangıç düğümünden DFS sırasını döner: [1, 3, 2, ...]

export function dfs(graph, startId, visited = new Set(), result = []) {
  visited.add(startId);
  result.push(startId);

  // Komşuları al
  const neighbors = graph.getNeighbors(startId);

  neighbors.forEach((neighborObj) => {
    const neighborId = neighborObj.node.id;
    if (!visited.has(neighborId)) {
      dfs(graph, neighborId, visited, result);
    }
  });

  return result; // Ziyaret sırası
}