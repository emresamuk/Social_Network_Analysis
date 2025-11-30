import ForceGraph2D from "react-force-graph-2d";

export default function GraphView({ graph, onNodeClick, highlight, graphRef }) {
  const highlightSet = new Set(highlight);

  return (
    <ForceGraph2D
      ref={graphRef}
      graphData={graph}
      enableNodeDrag={true}
      backgroundColor="#fafafa"
      nodeRelSize={6}
      width={window.innerWidth}
      height={window.innerHeight}
      onNodeClick={onNodeClick}
      linkColor={() => "#999"}
      nodeCanvasObject={(node, ctx) => {
        const isH = highlightSet.has(node.id);

        ctx.fillStyle = isH ? "#ff5252" : "#1976d2";

        ctx.beginPath();
        ctx.arc(node.x, node.y, isH ? 9 : 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.textAlign = "center";
        ctx.fillStyle = "#000";
        ctx.font = "11px sans-serif";
        ctx.fillText(node.id, node.x, node.y - 10);
      }}
    />
  );
}
