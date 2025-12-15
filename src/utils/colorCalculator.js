export function calculateNodeColor(node) {
  const aktif = node.aktiflik ?? 0;
  const etk = (node.etkileşim ?? 0) / 10;
  const bag = (node.bagSayisi ?? 0) / 5;

  // Ağırlıklı toplam
  const score = (aktif * 0.5) + (etk * 0.3) + (bag * 0.2);


  if (score < 0.25) return "#4caf50";   
  if (score < 0.5) return "#cddc39";    
  if (score < 0.75) return "#ff9800";   
  return "#f44336";                     
}
