import { useRef, useState } from "react";

import GraphView from "./components/GraphView";
import NodeInfo from "./components/NodeInfo";
import Controls from "./components/Controls";
import { Graph } from "./GraphModel"; 
import { bfs } from "./algorithms/bfs";
import { dfs } from "./algorithms/dfs";
import { dijkstra } from "./algorithms/dijkstra";
import { astar } from "./algorithms/astar";
import { connectedComponents } from "./algorithms/connected";
import { welshPowell } from "./algorithms/welshPowell";

import { saveGraphFile, loadGraphFile } from "./utils/fileManager";

import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Typography,
  Box,
  Paper,
  Fade
} from "@mui/material";

//TEMA AYARLARI
const modernTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00e5ff",
      contrastText: "#000",
    },
    secondary: {
      main: "#d500f9",
    },
    background: {
      default: "#0a0e17",
      paper: "rgba(22, 27, 34, 0.7)",
    },
    text: {
      primary: "#e0e0e0",
      secondary: "#9e9e9e",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
      letterSpacing: "0.5px",
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
  },
});

// Renk Paleti (Welsh-Powell için)
const COLOR_PALETTE = [
  "#FF5733", "#33FF57", "#3357FF", "#F033FF", "#FF33A8", 
  "#33FFF5", "#F5FF33", "#FF8C33", "#8C33FF", "#33FF8C"
];

export default function App() {
  const [graph, setGraph] = useState({
    nodes: [
      { id: 1, aktiflik: 0.8, etkileşim: 10, bagSayisi: 2 },
      { id: 2, aktiflik: 0.5, etkileşim: 7, bagSayisi: 1 },
      { id: 3, aktiflik: 0.6, etkileşim: 5, bagSayisi: 3 },
    ],
    links: [
      { source: 1, target: 2, weight: 1 },
      { source: 2, target: 3, weight: 1 },
      { source: 1, target: 3, weight: 1 },
    ],
  });

  const [selectedNode, setSelectedNode] = useState(null);
  const [result, setResult] = useState(null);
  const [highlightNodes, setHighlightNodes] = useState([]);
  
  // Welsh-Powell renk haritası { 1: "#FF0000", 2: "#00FF00" }
  const [nodeColors, setNodeColors] = useState({}); 

  const fgRef = useRef();

  const clearVisuals = () => {
    setHighlightNodes([]);
    setNodeColors({});
  };

  //ALGORITMALAR
  
  const runBfs = () => {
    if (!selectedNode) return alert("Lütfen başlangıç için bir düğüm seçin!");
    clearVisuals();

    // 1. Düz veriyi Graph sınıfına çevir
    const graphInstance = Graph.fromJSON(graph);
    
    // 2. Algoritmayı çalıştır
    const order = bfs(graphInstance, selectedNode.id);
    
    setResult({ title: "BFS (Breadth-First Search)", data: order });
    setHighlightNodes(order);
  };

  const runDfs = () => {
    if (!selectedNode) return alert("Lütfen başlangıç için bir düğüm seçin!");
    clearVisuals();

    const graphInstance = Graph.fromJSON(graph);
    const order = dfs(graphInstance, selectedNode.id);

    setResult({ title: "DFS (Depth-First Search)", data: order });
    setHighlightNodes(order);
  };

  const runDijkstra = () => {
    if (!selectedNode) return alert("Lütfen başlangıç için bir düğüm seçin!");
    clearVisuals();

    const graphInstance = Graph.fromJSON(graph);
    
    const dist = dijkstra(graphInstance, selectedNode.id);
    
    setResult({ title: "Dijkstra (En Kısa Yol)", data: dist });
    // Erişilebilen tüm düğümleri highlight yap
    setHighlightNodes(Object.keys(dist).map(Number));
  };

  const runAstar = () => {
    if (!selectedNode) return alert("Lütfen başlangıç için bir düğüm seçin!");
    const others = graph.nodes.filter(n => n.id !== selectedNode.id);
    if (others.length === 0) return alert("Grafikte başka düğüm yok!");
    const targetNode = others[others.length - 1];

    clearVisuals();
    const graphInstance = Graph.fromJSON(graph);
    
    const path = astar(graphInstance, selectedNode.id, targetNode.id);
    
    setResult({ 
      title: `A* Algoritması (${selectedNode.id} -> ${targetNode.id})`, 
      data: path || "Yol bulunamadı" 
    });
    setHighlightNodes(path || []);
  };

  const runConnected = () => {
    clearVisuals();
    const graphInstance = Graph.fromJSON(graph);
    
    const output = connectedComponents(graphInstance);
    setResult({ title: "Bağlı Bileşenler (Connected Components)", data: output });
  };

  const runColoring = () => {
    clearVisuals();
    const graphInstance = Graph.fromJSON(graph);
    
    const rawColors = welshPowell(graphInstance);
    
    const visualColors = {};
    Object.keys(rawColors).forEach(nodeId => {
      const colorIndex = rawColors[nodeId];
      visualColors[nodeId] = COLOR_PALETTE[(colorIndex - 1) % COLOR_PALETTE.length];
    });

    setNodeColors(visualColors);
    setResult({ title: "Welsh-Powell Renklendirme", data: rawColors });
  };

  //NODE/EDGE KISMI
  const addNode = () => {
    const newId =
      graph.nodes.length > 0
        ? Math.max(...graph.nodes.map((n) => n.id)) + 1
        : 1;

    const newNode = {
      id: newId,
      aktiflik: parseFloat(Math.random().toFixed(2)),
      etkileşim: Math.floor(Math.random() * 20),
      bagSayisi: 0, 
    };

    setGraph({
      ...graph,
      nodes: [...graph.nodes, newNode],
    });
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
    clearVisuals();
  };

  const addLink = () => {
    if (!selectedNode) return;
    const others = graph.nodes.filter((n) => n.id !== selectedNode.id);
    if (others.length === 0) return; 
    const randomNode = others[Math.floor(Math.random() * others.length)];

    // Bağlantı zaten var mı kontrol et
    const exists = graph.links.some(l => {
        const s = l.source.id ?? l.source;
        const t = l.target.id ?? l.target;
        return (s === selectedNode.id && t === randomNode.id) || 
               (s === randomNode.id && t === selectedNode.id);
    });

    if (exists) {
        alert("Bu bağlantı zaten var!");
        return;
    }

    const newLink = {
      source: selectedNode.id,
      target: randomNode.id,
      weight: 1, 
    };

    setGraph({ ...graph, links: [...graph.links, newLink] });
  };

  //JSON LOAD/SAVE
  const saveGraph = () => saveGraphFile(graph);

  const loadGraph = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadGraphFile(file, (newGraph) => {
        setGraph(newGraph);
        setSelectedNode(null);
        clearVisuals();
        setResult(null);
    });
  };

  const zoomIn = () => fgRef.current?.zoom(fgRef.current.zoom() * 1.2, 400);
  const zoomOut = () => fgRef.current?.zoom(fgRef.current.zoom() / 1.2, 400);
  const zoomToFit = () => fgRef.current?.zoomToFit(400, 40);
  const centerGraph = () => fgRef.current?.centerAt(0, 0, 400);

  return (
    <ThemeProvider theme={modernTheme}>
      <CssBaseline />

      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          position: "relative",
          bgcolor: "background.default",
        }}
      >
        
        {/*GRAFİK GÖRÜNÜMÜ */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
          }}
        >
          <GraphView
            graph={graph}
            onNodeClick={setSelectedNode}
            highlight={highlightNodes}
            nodeColors={nodeColors} 
            graphRef={fgRef}
          />
        </Box>

        {/*SOL ÜST BAŞLIK */}
        <Paper
          elevation={0}
          sx={{
            position: "absolute",
            top: 20,
            left: 20,
            zIndex: 10,
            padding: "12px 24px",
            borderRadius: "50px",
            background: "rgba(0, 229, 255, 0.1)",
            border: "1px solid rgba(0, 229, 255, 0.3)",
          }}
        >
          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
            SOSYAL AG ANALIZI <span style={{ color: 'white', fontWeight: 300 }}></span>
          </Typography>
        </Paper>

        {/* SAĞ PANEL */}
        <Box
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            bottom: 20,
            width: "360px",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            pointerEvents: "none",
          }}
        >
          {/* Seçili Node Bilgisi */}
          <Fade in={!!selectedNode} unmountOnExit>
            <Paper
              sx={{
                p: 2,
                pointerEvents: "auto", 
                borderLeft: "4px solid #d500f9", 
              }}
            >
              <Typography variant="subtitle2" color="secondary" gutterBottom>
                SEÇİLİ DÜĞÜM
              </Typography>
              <NodeInfo node={selectedNode} />
            </Paper>
          </Fade>

          {/* Ana Kontroller */}
          <Paper
            sx={{
              p: 0,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              pointerEvents: "auto",
            }}
          >
            <Box sx={{ p: 2, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
               <Typography variant="subtitle1" fontWeight="bold">Kontrol Paneli</Typography>
            </Box>
            
            <Box sx={{ p: 2, overflowY: "auto", flex: 1 }}>
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
                saveGraph={saveGraph}
                loadGraph={loadGraph}
                zoomIn={zoomIn}
                zoomOut={zoomOut}
                zoomToFit={zoomToFit}
                centerGraph={centerGraph}
              />
            </Box>
          </Paper>

          {/* Sonuç kısmı */}
          <Paper
            sx={{
              height: "200px",
              display: "flex",
              flexDirection: "column",
              bgcolor: "#000000 !important", 
              border: "1px solid #333",
              pointerEvents: "auto",
            }}
          >
            <Box sx={{ 
                px: 2, py: 1, 
                bgcolor: "#1a1a1a", 
                borderBottom: "1px solid #333",
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
              <Typography variant="caption" sx={{ fontFamily: "monospace", color: "#aaa" }}>
                TERMINAL ÇIKTISI
              </Typography>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: result ? '#00e676' : '#555' }} />
            </Box>
            
            <Box sx={{ 
                p: 2, 
                overflow: "auto", 
                flex: 1, 
                fontFamily: "'Fira Code', 'Consolas', monospace",
                fontSize: "0.85rem"
              }}>
              {result ? (
                <>
                  <Typography sx={{ color: "#00e5ff", mb: 1, fontWeight: 'bold' }}>
                    {">"} {result.title}
                  </Typography>
                  <Box component="pre" sx={{ m: 0, color: "#a5d6a7" }}>
                    {JSON.stringify(result.data, null, 2)}
                  </Box>
                </>
              ) : (
                <Typography sx={{ color: "#555", fontStyle: "italic" }}>
                  {">"} Bekleniyor... Bir işlem başlatın.
                </Typography>
              )}
            </Box>
          </Paper>
        </Box>

      </Box>
    </ThemeProvider>
  );
}