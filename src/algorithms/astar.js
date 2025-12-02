// A* algoritması: startId'den goalId'ye en kısa yolu bulur
function getId(n) {
  return n.id ?? n;
}

export function astar(graph, startId, goalId) {
  const adj = buildAdjacency(graph);

  const openSet = new Set([startId]);
  const cameFrom = {};
  const gScore = {};
  const fScore = {};

  graph.nodes.forEach((n) => {
    gScore[n.id] = Infinity;
    fScore[n.id] = Infinity;
  });

  gScore[startId] = 0;
  fScore[startId] = heuristic(startId, goalId);

  while (openSet.size > 0) {
    let current = null;
    let best = Infinity;
    for (const n of openSet) {
      if (fScore[n] < best) {
        best = fScore[n];
        current = n;
      }
    }

    if (current === goalId) {
      return reconstructPath(cameFrom, current);
    }

    openSet.delete(current);

    for (const { to, w } of adj[current] || []) {
      const tentative = gScore[current] + w;
      if (tentative < gScore[to]) {
        cameFrom[to] = current;
        gScore[to] = tentative;
        fScore[to] = gScore[to] + heuristic(to, goalId);
        openSet.add(to);
      }
    }
  }

  return null;
}

function heuristic(a, b) {
  return 0;
}

function reconstructPath(cameFrom, current) {
  const path = [current];
  while (current in cameFrom) {
    current = cameFrom[current];
    path.unshift(current);
  }
  return path;
}

function buildAdjacency(graph) {
  const adj = {};
  graph.nodes.forEach((n) => {
    adj[n.id] = [];
  });

  graph.links.forEach((l) => {
    const s = getId(l.source);
    const t = getId(l.target);
    const w = l.weight ?? 1;
    if (!adj[s]) adj[s] = [];
    if (!adj[t]) adj[t] = [];
    adj[s].push({ to: t, w });
    adj[t].push({ to: s, w });
  });

  return adj;
}
