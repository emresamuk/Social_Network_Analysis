

import { bfs } from './bfs.js';

export function connectedComponents(graph) {
  const visited = new Set();
  const components = [];

  graph.nodes.forEach((node) => {
    if (!visited.has(node.id)) {
      
      const componentNodes = bfs(graph, node.id);
      
      
      components.push(componentNodes);
      
      
      componentNodes.forEach(id => visited.add(id));
    }
  });

  return components; 
}