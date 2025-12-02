// Başlangıç düğümünden tüm düğümlere en kısa mesafeleri döner: {1: 0, 2: 1, 3: 2, ...}

function getId(n) {
  return n.id ?? n;
}

export function dijkstra(graph, startId) {
  const adj = buildAdjacency(graph);
  const dist = {};
  const visited = new Set();

  graph.nodes.forEach((n) => {
    dist[n.id] = Infinity;
  });
  dist[startId] = 0;

  while (true) {
    let u = null;
    let best = Infinity;
    for (const id in dist) {
      if (!visited.has(Number(id)) && dist[id] < best) {
        best = dist[id];
        u = Number(id);
      }
    }
    if (u === null) break;

    visited.add(u);

    for (const { to, w } of adj[u] || []) {
      if (dist[u] + w < dist[to]) {
        dist[to] = dist[u] + w;
      }
    }
  }

  return dist;
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
