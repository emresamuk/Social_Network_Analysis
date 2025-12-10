import ForceGraph2D from "react-force-graph-2d";

export default function GraphView({
  graph,
  highlight = [],
  selectedEdge,
  graphRef,
  onNodeClick,
  onLinkClick,
  renameNode
}) {
  const highlightSet = new Set(highlight);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <ForceGraph2D
        ref={graphRef}
        graphData={graph}
        backgroundColor="#f5f5f5"
        enableNodeDrag={true}
        autoPauseRedraw={false}
        linkWidth={(link) => {
          const s1 = selectedEdge?.source?.id ?? selectedEdge?.source;
          const t1 = selectedEdge?.target?.id ?? selectedEdge?.target;
          const s2 = link.source?.id ?? link.source;
          const t2 = link.target?.id ?? link.target;
          return selectedEdge && s1 === s2 && t1 === t2 ? 3 : 1;
        }}
        onNodeClick={onNodeClick}
        onLinkClick={onLinkClick}
        nodeCanvasObject={(node, ctx) => {
          const isHighlighted = highlightSet.has(node.id);
          ctx.fillStyle = isHighlighted ? "#ff5252" : "#1976d2";
          ctx.beginPath();
          ctx.arc(node.x, node.y, isHighlighted ? 9 : 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#000";
          ctx.font = "10px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(node.id, node.x, node.y - 10);
        }}
       onNodeDoubleClick={(node) => {
          const newName = prompt("Yeni isim:", node.id);
          if (!newName) return;

  
          renameNode(node.id, newName);
        }}

      />
    </div>
  );
}
