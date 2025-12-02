// Bağlı komponentleri döner: [[1,2,3], [4,5], ...]

function getId(n) {
  return n.id ?? n;
}

export function connectedComponents(graph) {
  const adj = buildAdjacency(graph);
  const visited = new Set();
  const components = [];

  for (const node of graph.nodes) {
    const id = node.id;
    if (visited.has(id)) continue;

    const comp = [];
    const stack = [id];
    visited.add(id);

    while (stack.length > 0) {
      const v = stack.pop();
      comp.push(v);
      for (const nei of adj[v] || []) {
        if (!visited.has(nei)) {
          visited.add(nei);
          stack.push(nei);
        }
      }
    }

    components.push(comp);
  }

  return components;
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
