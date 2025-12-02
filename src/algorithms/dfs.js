// Başlangıç düğümünden DFS sırasını döner: [1, 3, 2, ...]

function getId(n) {
  return n.id ?? n;
}

export function dfs(graph, startId) {
  const adj = buildAdjacency(graph);
  const visited = new Set();
  const order = [];

  function visit(node) {
    visited.add(node);
    order.push(node);
    for (const nei of adj[node] || []) {
      if (!visited.has(nei)) {
        visit(nei);
      }
    }
  }

  visit(startId);
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
    adj[t].push(s);
  });

  return adj;
}
