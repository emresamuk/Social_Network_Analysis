// Başlangıç düğümünden tüm düğümlere en kısa mesafeleri döner: {1: 0, 2: 1, 3: 2, ...}

export function dijkstra(graph, startId) {
  const distances = {};
  const visited = new Set();

  // Başlangıçta tüm mesafeler sonsuz
  graph.nodes.forEach((n) => (distances[n.id] = Infinity));
  distances[startId] = 0;

  while (true) {
    let closestNode = null;
    let shortestDist = Infinity;

    // Ziyaret edilmemiş ve en küçük mesafeye sahip düğümü bul
    for (const nodeId in distances) {
      const dist = distances[nodeId];
      if (!visited.has(parseInt(nodeId)) && dist < shortestDist) {
        closestNode = parseInt(nodeId);
        shortestDist = dist;
      }
    }

    // Erişilebilir düğüm kalmadıysa bitir
    if (closestNode === null || shortestDist === Infinity) break;

    visited.add(closestNode);

    // Komşuları güncelle
    const neighbors = graph.getNeighbors(closestNode);
    
    neighbors.forEach((neighborObj) => {
      const neighborId = neighborObj.node.id;
      
      const weight = neighborObj.weight; 
      
      const newDist = shortestDist + weight;

      if (newDist < distances[neighborId]) {
        distances[neighborId] = newDist;
      }
    });
  }

  return distances;
}
