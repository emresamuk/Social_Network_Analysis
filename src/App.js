import { useRef, useState } from "react";

import GraphView from "./components/GraphView";
import NodeInfo from "./components/NodeInfo";
import Controls from "./components/Controls";

import { bfs } from "./algorithms/bfs";
import { dfs } from "./algorithms/dfs";
import { dijkstra } from "./algorithms/dijkstra";
import { astar } from "./algorithms/astar";
import { connectedComponents } from "./algorithms/connected";
import { welshPowell } from "./algorithms/welshPowell";

import { saveGraphFile, loadGraphFile } from "./utils/fileManager";

import FloydWarshallPanel from "./components/FloydWarshallPanel";
import { floydWarshall, getFwPath } from "./services/graphAlgorithms";


import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Paper,
  Divider,
} from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#ff5252" },
  },
});

export default function App() {
  const [graph, setGraph] = useState({
    nodes: [
      { id: 1, aktiflik: 0.8, etkileşim: 10 },
      { id: 2, aktiflik: 0.5, etkileşim: 7 },
      { id: 3, aktiflik: 0.6, etkileşim: 5 },
    ],
    links: [
      { source: 1, target: 2, weight: 1 },
      { source: 2, target: 3, weight: 1 },
      { source: 1, target: 3, weight: 1 },
    ],
  });

  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [result, setResult] = useState(null);
  const [highlightNodes, setHighlightNodes] = useState([]);

  const [fwResult, setFwResult] = useState(null);
  const [fwPath, setFwPath] = useState([]);

  const fgRef = useRef();

  

  const runBfs = () => {
    if (!selectedNode) return;
    const order = bfs(graph, selectedNode.id);
    setResult({ title: "BFS", data: order });
    setHighlightNodes(order);
  };

  const runDfs = () => {
    if (!selectedNode) return;
    const order = dfs(graph, selectedNode.id);
    setResult({ title: "DFS", data: order });
    setHighlightNodes(order);
  };

  const runDijkstra = () => {
    if (!selectedNode) return;
    const dist = dijkstra(graph, selectedNode.id);
    setResult({ title: "Dijkstra", data: dist });
    setHighlightNodes(Object.keys(dist).map(Number));
  };

  const runAstar = () => {
    if (!selectedNode) return;
    const path = astar(graph, selectedNode.id, 3);
    setResult({ title: "A*", data: path });
    setHighlightNodes(path || []);
  };

  const runConnected = () => {
    const output = connectedComponents(graph);
    setResult({ title: "Bağlı Komponentler", data: output });
    setHighlightNodes([]);
  };

  const runColoring = () => {
    const output = welshPowell(graph);
    setResult({ title: "Renkleme", data: output });
    setHighlightNodes(Object.keys(output).map(Number));
  };
  function runFloydWarshall(start, end) {
  const result = floydWarshall(graph);
  setFwResult(result);

  const path = getFwPath(result.next, start, end) || [];
  setFwPath(path);
  setHighlightNodes(path);
}

  

  const addNode = () => {
    const newId =
      graph.nodes.length > 0
        ? Math.max(...graph.nodes.map((n) => n.id)) + 1
        : 1;

    const newNode = {
      id: newId,
      aktiflik: Math.random(),
      etkileşim: Math.floor(Math.random() * 10),
    };

    setGraph({ ...graph, nodes: [...graph.nodes, newNode] });
  };

  const deleteNode = () => {
    if (!selectedNode) return;

    const newNodes = graph.nodes.filter((n) => n.id !== selectedNode.id);

    const newLinks = graph.links.filter((l) => {
      const s = l.source.id ?? l.source;
      const t = l.target.id ?? l.target;
      return s !== selectedNode.id && t !== selectedNode.id;
    });

    setGraph({ nodes: newNodes, links: newLinks });
    setSelectedNode(null);
    setSelectedEdge(null);
  };

  const addLink = () => {
    if (!selectedNode) return;

    const others = graph.nodes.filter((n) => n.id !== selectedNode.id);
    if (others.length === 0) return;

    const random = others[Math.floor(Math.random() * others.length)];

    const newLink = {
      source: selectedNode.id,
      target: random.id,
      weight: 1,
    };

    setGraph({ ...graph, links: [...graph.links, newLink] });
  };

  const deleteLink = () => {
  if (!selectedEdge) return;

  const newLinks = graph.links.filter((l) => {
    const s = l.source.id ?? l.source;
    const t = l.target.id ?? l.target;

    const ss = selectedEdge.source.id ?? selectedEdge.source;
    const tt = selectedEdge.target.id ?? selectedEdge.target;

    return !(s === ss && t === tt);
  });

  setGraph({ ...graph, links: newLinks });
  setSelectedEdge(null);
};


  

  const saveGraph = () => saveGraphFile(graph);

  const loadGraph = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    loadGraphFile(file, (json) => {
      setGraph(json);
      setSelectedNode(null);
      setSelectedEdge(null);
      setHighlightNodes([]);
      setResult(null);
    });
  };

  

  const zoomIn = () =>
    fgRef.current?.zoom(fgRef.current.zoom() * 1.2, 400);

  const zoomOut = () =>
    fgRef.current?.zoom(fgRef.current.zoom() / 1.2, 400);

  const zoomToFit = () => fgRef.current?.zoomToFit(400, 40);

  const centerGraph = () => fgRef.current?.centerAt(0, 0, 400);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Sosyal Ağ Analizi</Typography>
        </Toolbar>
      </AppBar>

      <Box
        display="flex"
        height="calc(100vh - 64px)"
        width="100%"
        overflow="hidden"
      >
        
        <Box
          flex="1"
          position="relative"
          bgcolor="#f5f5f5"
          borderRight="1px solid #ddd"
          overflow="hidden"
        >
          <GraphView
            graph={graph}
            highlight={highlightNodes}
            selectedEdge={selectedEdge}
            graphRef={fgRef}
            onNodeClick={(node) => {
              setSelectedNode(node);
              setSelectedEdge(null);
            }}
            onLinkClick={(edge) => {
              setSelectedEdge(edge);
              setSelectedNode(null);
            }}
          />
        </Box>

        
        <Box
          width="380px"
          minWidth="380px"
          maxWidth="380px"
          bgcolor="#ffffff"
          p={2}
          display="flex"
          flexDirection="column"
          overflow="hidden"
          boxShadow="0 0 4px rgba(0,0,0,0.2)"
        >
          
          <Paper sx={{ p: 2, mb: 2 }} elevation={3}>
            <NodeInfo node={selectedNode} edge={selectedEdge} />
          </Paper>

         
          <Paper
            sx={{ p: 2, mb: 2, maxHeight: "260px", overflow: "auto" }}
            elevation={3}
          >
            <Controls
              runBfs={runBfs}
              runDfs={runDfs}
              runDijkstra={runDijkstra}
              runAstar={runAstar}
              runConnected={runConnected}
              runColoring={runColoring}
              addNode={addNode}
              deleteNode={deleteNode}
              addLink={addLink}
              deleteLink={deleteLink}
              saveGraph={saveGraph}
              loadGraph={loadGraph}
              zoomIn={zoomIn}
              zoomOut={zoomOut}
              zoomToFit={zoomToFit}
              centerGraph={centerGraph}
            />
          </Paper>
          <Paper sx={{ p: 2, mb: 2 }} elevation={3}>
          <FloydWarshallPanel 
          onRun={runFloydWarshall} 
            nodes={graph.nodes} 
         />
        </Paper>


          {/* Sonuç */}
          <Paper
            sx={{
              p: 2,
              flex: 1,
              overflow: "auto",
              bgcolor: "#1e1e1e",
              color: "#00e676",
              fontFamily: "monospace",
            }}
            elevation={4}
          >
            {result ? (
              <>
                <Typography variant="h6" sx={{ color: "#4fc3f7" }}>
                  {result.title}
                </Typography>
                <Divider sx={{ mb: 1 }} />
                {JSON.stringify(result.data, null, 2)}
              </>
            ) : (
              <Typography color="gray">
                Bir algoritma çalıştırıldığında sonuç burada görünecek.
              </Typography>
            )}
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
