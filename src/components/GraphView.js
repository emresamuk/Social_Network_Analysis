import React, { useEffect, useState, useMemo } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material";

/**

  @param {Object} graph  // { nodes: [], links: [] } formatında veri (GraphModel'den gelen)
  @param {Function} onNodeClick - Düğüme tıklanınca çalışacak fonksiyon
  @param {Array} highlight - Vurgulanacak düğüm ID'leri listesi 
  @param {Object} nodeColors - Welsh-Powell veya diğer algoritmalardan gelen renk haritası
  @param {Object} graphRef - Ref nesnesi
 */
export default function GraphView({ graph, onNodeClick, highlight, nodeColors = {}, graphRef }) {
  const theme = useTheme();
  
  // Highlight listesi her değiştiğinde Set'i yeniden oluştur 
  const highlightSet = useMemo(() => new Set(highlight), [highlight]);

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Renk Tanımları ---
  const defaultNodeColor = theme.palette.primary.main;
  const highlightNodeColor = theme.palette.secondary.main;
  const textColor = theme.palette.text.primary;
  const linkColor = alpha(theme.palette.text.secondary, 0.2);
  const highlightLinkColor = theme.palette.secondary.main;

  return (
    <ForceGraph2D
      ref={graphRef}
      graphData={graph}
      enableNodeDrag={true}
      backgroundColor="rgba(0,0,0,0)"
      width={dimensions.width}
      height={dimensions.height}
      onNodeClick={onNodeClick}

      // --- Kenar (Link) Ayarları ---
      
      linkLabel={(link) => {
          const weight = link.weight ? link.weight.toFixed(2) : "1.00";
          return `Ağırlık (Maliyet): ${weight}`;
      }}

      linkColor={(link) => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        
        // Eğer her iki uçtaki düğüm highlight listesindeyse kenarı da boya
        if (highlightSet.has(sourceId) && highlightSet.has(targetId)) {
            return highlightLinkColor;
        }
        return linkColor;
      }}

      linkWidth={(link) => {
         const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
         const targetId = typeof link.target === 'object' ? link.target.id : link.target;
         return (highlightSet.has(sourceId) && highlightSet.has(targetId)) ? 4 : 1;
      }}

      linkDirectionalParticles={2}
      linkDirectionalParticleWidth={(link) => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        return (highlightSet.has(sourceId) && highlightSet.has(targetId)) ? 4 : 0;
      }}
      linkDirectionalParticleColor={() => highlightNodeColor}

      // --- Düğüm (Node) Çizimi ---
      nodeCanvasObject={(node, ctx) => {
        const isH = highlightSet.has(node.id);
        
        let color = isH ? highlightNodeColor : (nodeColors[node.id] || defaultNodeColor);
        
        const size = isH ? 8 : 5;

        ctx.shadowColor = color;
        ctx.shadowBlur = isH ? 20 : 0; 
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;

        ctx.fillStyle = textColor;
        ctx.font = `${isH ? "bold " : ""}12px "Inter", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(`ID: ${node.id}`, node.x, node.y - size - 4);
      }}
      
      nodePointerAreaPaint={(node, color, ctx) => {
        const size = highlightSet.has(node.id) ? 8 : 5;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size + 4, 0, Math.PI * 2);
        ctx.fill();
      }}
    />
  );
}