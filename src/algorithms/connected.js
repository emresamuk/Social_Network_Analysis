// Bağlı komponentleri döner: [[1,2,3], [4,5], ...]

import { bfs } from './bfs.js';

export function connectedComponents(graph) {
  const visited = new Set();
  const components = [];

  graph.nodes.forEach((node) => {
    if (!visited.has(node.id)) {
      // Ziyaret edilmemiş bir düğüm bulduğumuzda, o düğümden başlayan bir BFS/DFS yaparız
      // Bu BFS o bileşendeki TÜM düğümleri bulur
      const componentNodes = bfs(graph, node.id);
      
      // Bulunan bileşeni listeye ekle
      components.push(componentNodes);
      
      // Bu bileşendeki herkesi ana visited setine ekle ki tekrar bakmayalım
      componentNodes.forEach(id => visited.add(id));
    }
  });

  return components; // Örn: [[1,2,3], [4,5], [6]]
}