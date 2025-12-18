// Renk Paleti (Her renk bir index'e karşılık gelir)
const COLORS = [
  "#e57373", "#ba68c8", "#64b5f6", "#4db6ac", "#fff176", 
  "#ffb74d", "#a1887f", "#90a4ae", "#f06292", "#7986cb",
  "#4dd0e1", "#81c784", "#dce775", "#ff8a65"
];

// YARDIMCI: İki düğüm komşu mu?
const isAdjacent = (node1Id, node2Id, links) => {
  return links.some(
    (l) =>
      (l.source.id === node1Id && l.target.id === node2Id) ||
      (l.source.id === node2Id && l.target.id === node1Id) ||
      (l.source === node1Id && l.target === node2Id) ||
      (l.source === node2Id && l.target === node1Id)
  );
};

// YARDIMCI: Grafiği ayrık topluluklara (components) ayır
const getConnectedComponents = (nodes, links) => {
  const visited = new Set();
  const components = [];

  nodes.forEach((node) => {
    if (!visited.has(node.id)) {
      const component = [];
      const queue = [node];
      visited.add(node.id);

      while (queue.length > 0) {
        const current = queue.shift();
        component.push(current);

        // Komşuları bul (visited olmayanlar)
        const neighbors = nodes.filter(n => 
          !visited.has(n.id) && isAdjacent(current.id, n.id, links)
        );

        neighbors.forEach(neighbor => {
          visited.add(neighbor.id);
          queue.push(neighbor);
        });
      }
      components.push(component);
    }
  });

  return components;
};

// ANA FONKSİYON
export const welshPowell = (graph) => {
  // graph nesnesi { nodes: [], links: [] } formatında gelmeli
  const { nodes, links } = graph;
  
  // 1. Ayrık Toplulukları Bul
  const components = getConnectedComponents(nodes, links);
  
  let finalColors = {}; // Grafiği boyamak için { id: renk } haritası
  let tables = [];      // Raporlama tablosu

  // Her topluluğu bağımsız olarak işle
  components.forEach((componentNodes, index) => {
    
    // 2. Her düğümün derecesini (bağlantı sayısını) hesapla
    const degrees = componentNodes.map(node => {
      const degree = links.filter(l => 
        (l.source.id === node.id || l.source === node.id) || 
        (l.target.id === node.id || l.target === node.id)
      ).length;
      return { ...node, degree };
    });

    // 3. Welsh-Powell Kuralı: Dereceye göre BÜYÜKTEN KÜÇÜĞE sırala
    degrees.sort((a, b) => b.degree - a.degree);

    const nodeColors = {};
    let colorIndex = 0;
    const assignedNodes = new Set();

    // 4. Renklendirme Döngüsü
    for (let i = 0; i < degrees.length; i++) {
      const currentNode = degrees[i];
      if (assignedNodes.has(currentNode.id)) continue;

      // Renk seç
      const currentColor = COLORS[colorIndex % COLORS.length];
      
      nodeColors[currentNode.id] = currentColor;
      assignedNodes.add(currentNode.id);

      // Bu renge boyanabilecek diğer (komşu olmayan) düğümleri bul
      for (let j = i + 1; j < degrees.length; j++) {
        const candidate = degrees[j];
        if (assignedNodes.has(candidate.id)) continue;

        // Aday düğüm, şu anki renk grubundan herhangi biriyle komşu mu?
        const isConnectedToCurrentColor = degrees.filter(n => 
          nodeColors[n.id] === currentColor && isAdjacent(n.id, candidate.id, links)
        ).length > 0;

        if (!isConnectedToCurrentColor) {
          nodeColors[candidate.id] = currentColor;
          assignedNodes.add(candidate.id);
        }
      }
      colorIndex++;
    }

    // Renkleri ana listeye ekle
    Object.assign(finalColors, nodeColors);

    // 5. TABLO VERİSİNİ OLUŞTUR
    // İstenilen format: Topluluk, Düğüm, Derece, Renk
    tables.push({
      topluluk: `Topluluk ${index + 1}`,
      veriler: degrees.map(n => ({
        Düğüm: n.id,
        Derece: n.degree,
        Renk: nodeColors[n.id] // Hex kodu döner
      }))
    });
  });

  // İki veri döndürüyoruz: 
  // 1. coloring: Grafiği boyamak için
  // 2. detailedTables: Ekrana tablo basmak için
  return { coloring: finalColors, detailedTables: tables };
};