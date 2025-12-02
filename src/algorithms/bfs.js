// Başlangıç düğümünden BFS sırasını döner: [1, 2, 3, ...]

function getId(n) {
  return n.id ?? n;
}

export function bfs(graph, startId) {
  const adj = buildAdjacency(graph);
  const visited = new Set();
  const queue = [startId];
  const order = [];

  visited.add(startId);

  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);

    for (const nei of adj[node] || []) {
      if (!visited.has(nei)) {
        visited.add(nei);
        queue.push(nei);
      }
    }
  }

  return order;
}

function buildAdjacency(graph) {
  const adj = {};
  graph.nodes.forEach((n) => {
    adj[n.id] = [];
  });

  graph.links.forEach((l) => {
    const s = getId(l.source);
    const t = getId(l.target);
    if (!adj[s]) adj[s] = [];
    if (!adj[t]) adj[t] = [];
    adj[s].push(t);
    adj[t].push(s); // yönsüz
  });

  return adj;
}
