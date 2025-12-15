// burada welshPowell ile renklendirme yapacağız

export function welshPowell(graph) {
  // 1. Adım: Düğümleri derecelerine (bağlantı sayısı) göre büyükten küçüğe sırala
  const sortedNodes = [...graph.nodes].sort((a, b) => {
    const degreeA = graph.getNeighbors(a.id).length;
    const degreeB = graph.getNeighbors(b.id).length;
    return degreeB - degreeA;
  });

  const colors = {};
  let colorIndex = 1;

  // 2. Adım: Sırayla renklendirme
  for (let i = 0; i < sortedNodes.length; i++) {
    const node = sortedNodes[i];
    
    // Eğer düğüm zaten boyanmışsa atla
    if (colors[node.id]) continue;

    // İlk boş düğüme mevcut rengi ata
    colors[node.id] = colorIndex;

    // Bu renge boyanabilecek diğer (komşu olmayan) düğümleri bul
    for (let j = i + 1; j < sortedNodes.length; j++) {
      const potentialNode = sortedNodes[j];
      
      if (colors[potentialNode.id]) continue;

      const neighbors = graph.getNeighbors(potentialNode.id);
      
      const isAdjacentToCurrentColor = neighbors.some(
        (n) => colors[n.node.id] === colorIndex
      );

      if (!isAdjacentToCurrentColor) {
        colors[potentialNode.id] = colorIndex;
      }
    }

    // Bir sonraki renk grubuna geç
    colorIndex++;
  }

  return colors;
}