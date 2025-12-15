// A* algoritması: startId'den goalId'ye en kısa yolu bulur
function heuristic(a, b) {
  return 0; 
}

export function astar(graph, startId, goalId) {
  const openSet = new Set([startId]);
  const cameFrom = {};
  
  // Mesafe skorlarını tutan nesneler
  const gScore = {}; 
  const fScore = {};

  graph.nodes.forEach((n) => {
    gScore[n.id] = Infinity;
    fScore[n.id] = Infinity;
  });

  gScore[startId] = 0;
  fScore[startId] = heuristic(startId, goalId);

  while (openSet.size > 0) {
    // fScore değeri en düşük olan düğümü seç
    const current = Array.from(openSet).reduce((a, b) =>
      fScore[a] < fScore[b] ? a : b
    );

    if (current === goalId) {
      const path = [];
      let temp = current;
      while (temp !== undefined) {
        path.push(temp);
        temp = cameFrom[temp];
      }
      return path.reverse();
    }

    openSet.delete(current);

    const neighbors = graph.getNeighbors(current);

    neighbors.forEach((neighborObj) => {
      const neighborId = neighborObj.node.id;
      // İster 4.3: Dinamik hesaplanmış ağırlığı
      const weight = neighborObj.weight; 
      
      const tentativeG = gScore[current] + weight;

      if (tentativeG < gScore[neighborId]) {
        cameFrom[neighborId] = current;
        gScore[neighborId] = tentativeG;
        fScore[neighborId] = gScore[neighborId] + heuristic(neighborId, goalId);
        openSet.add(neighborId);
      }
    });
  }

  return null;
}