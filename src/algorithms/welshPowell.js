// burada welshPowell ile renklendirme yapacağız
function getId(n) {
  return n.id ?? n;
}

export function welshPowell(graph) {
  const adj = buildAdjacency(graph);

  // Dereceye göre azalan sırala
  const nodesSorted = [...graph.nodes].sort((a, b) => {
    const da = (adj[a.id] || []).length;
    const db = (adj[b.id] || []).length;
    return db - da;
  });

  const color = {};
  let currentColor = 0;

  for (const node of nodesSorted) {
    const id = node.id;
    if (color[id] !== undefined) continue;

    color[id] = currentColor;

    for (const other of nodesSorted) {
      const oid = other.id;
      if (color[oid] !== undefined) continue;
      const neighbors = adj[oid] || [];
      const conflict = neighbors.some((nei) => color[nei] === currentColor);
      if (!conflict) {
        color[oid] = currentColor;
      }
    }

    currentColor++;
  }

  return color;
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
