
export function floydWarshall(graph) {
  const nodes = graph.nodes.map(n => n.id);
  const dist = {};
  const next = {};

  nodes.forEach(i => {
    dist[i] = {};
    next[i] = {};
    nodes.forEach(j => {
      dist[i][j] = i === j ? 0 : Infinity;
      next[i][j] = null;
    });
  });

  graph.links.forEach(link => {
    const s = link.source.id ?? link.source;
    const t = link.target.id ?? link.target;
    dist[s][t] = 1;
    next[s][t] = t;
  });

  nodes.forEach(k => {
    nodes.forEach(i => {
      nodes.forEach(j => {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          next[i][j] = next[i][k];
        }
      });
    });
  });

  return { dist, next };
}

export function getFwPath(next, start, end) {
  if (!next[start][end]) return null;
  const path = [start];
  while (start !== end) {
    start = next[start][end];
    path.push(start);
  }
  return path;
}
