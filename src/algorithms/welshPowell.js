const COLORS = [
  "#e57373", "#ba68c8", "#64b5f6", "#4db6ac", "#fff176",
  "#ffb74d", "#a1887f", "#90a4ae", "#f06292", "#7986cb",
  "#4dd0e1", "#81c784", "#dce775", "#ff8a65"
];

const isAdjacent = (node1Id, node2Id, links) => {
  return links.some(
    (l) =>
      (l.source?.id === node1Id && l.target?.id === node2Id) ||
      (l.source?.id === node2Id && l.target?.id === node1Id) ||
      (l.source === node1Id && l.target === node2Id) ||
      (l.source === node2Id && l.target === node1Id)
  );
};

//Ayrık toplulukları bul
const getConnectedComponents = (nodes, links) => {
  const visited = new Set();
  const components = [];

  nodes.forEach((node) => {
    if (visited.has(node.id)) return;

    const queue = [node];
    const component = [];
    visited.add(node.id);

    while (queue.length > 0) {
      const current = queue.shift();
      component.push(current);

      nodes.forEach((n) => {
        if (!visited.has(n.id) && isAdjacent(current.id, n.id, links)) {
          visited.add(n.id);
          queue.push(n);
        }
      });
    }

    components.push(component);
  });

  return components;
};

//Welsh–Powell Renklendirme
export const welshPowell = (graph) => {
  const { nodes, links } = graph;

  const components = getConnectedComponents(nodes, links);

  let finalColors = {}; 
  let tables = [];

  components.forEach((componentNodes, componentIndex) => {
    // Dereceleri hesapla
    const degrees = componentNodes.map((node) => {
      const degree = links.filter(
        (l) =>
          l.source?.id === node.id ||
          l.target?.id === node.id ||
          l.source === node.id ||
          l.target === node.id
      ).length;

      return { ...node, degree };
    });

    // Dereceye göre büyükten küçüğe sırala
    degrees.sort((a, b) => b.degree - a.degree);

    const nodeColors = {};
    const used = new Set();
    let colorIndex = 0;

    //Welsh–Powell boyama
    for (let i = 0; i < degrees.length; i++) {
      const node = degrees[i];
      if (used.has(node.id)) continue;

      const color = COLORS[colorIndex % COLORS.length];
      nodeColors[node.id] = color;
      used.add(node.id);

      for (let j = i + 1; j < degrees.length; j++) {
        const candidate = degrees[j];
        if (used.has(candidate.id)) continue;

        const conflict = Object.keys(nodeColors).some(
          (id) =>
            nodeColors[id] === color &&
            isAdjacent(Number(id), candidate.id, links)
        );

        if (!conflict) {
          nodeColors[candidate.id] = color;
          used.add(candidate.id);
        }
      }

      colorIndex++;
    }

    // renk haritasına ekle
    Object.assign(finalColors, nodeColors);

    //Tablo verisi oluştur
    tables.push({
      topluluk: `Topluluk ${componentIndex + 1}`,
      veriler: degrees.map((n) => ({
        Düğüm: n.id,
        Derece: n.degree,
        Renk: nodeColors[n.id]
      }))
    });
  });

  return {
    coloring: finalColors,       
    detailedTables: tables        
  };
};
