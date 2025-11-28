import ForceGraph2D from "react-force-graph-2d";

export default function GraphView({ graph, onNodeClick }) {
  return (
    <ForceGraph2D
      graphData={graph}
      backgroundColor="#fafafa"
      style={{ width: "100%", height: "100%" }}
      onNodeClick={onNodeClick}
      nodeCanvasObject={(node, ctx) => {
        ctx.fillStyle = "#1976d2";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 6, 0, Math.PI * 2);
        ctx.fill();
      }}
    />
  );
}
