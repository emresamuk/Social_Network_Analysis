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

import {
  saveGraphFile,
  loadGraphFile,
  saveGraphToCSV,
  loadGraphFromCSV,
} from "./utils/fileManager";

import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Typography,
  Box,
  Paper,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

// TEMA AYARLARI
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
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [result, setResult] = useState(null);
  const [highlightNodes, setHighlightNodes] = useState([]);
  const [nodeColors, setNodeColors] = useState({});

  // Undo/Redo
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);

  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const [targetNodeId, setTargetNodeId] = useState("");

  const fgRef = useRef();

  const clearVisuals = () => {
    setHighlightNodes([]);
    setNodeColors({});
  };

  const pushHistory = (currentGraph) => {
    setHistory((prev) => [...prev, JSON.stringify(currentGraph)]);
    setFuture([]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const previous = JSON.parse(history[history.length - 1]);

    setFuture((f) => [...f, JSON.stringify(graph)]);
    setHistory((h) => h.slice(0, -1));
    setGraph(previous);
    clearVisuals();
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = JSON.parse(future[future.length - 1]);

    setHistory((h) => [...h, JSON.stringify(graph)]);
    setFuture((f) => f.slice(0, -1));
    setGraph(next);
    clearVisuals();
  };

  const renameNode = (oldId, newId) => {
    if (!newId || newId === oldId) return;
    pushHistory(graph);

    const newNodes = graph.nodes.map((n) =>
      n.id === oldId ? { ...n, id: newId } : n
    );
    const newLinks = graph.links.map((l) => ({
      ...l,
      source:
        (l.source.id ?? l.source) === oldId ? newId : l.source.id ?? l.source,
      target:
        (l.target.id ?? l.target) === oldId ? newId : l.target.id ?? l.target,
    }));

    setGraph({ nodes: newNodes, links: newLinks });
  };

  const exportPNG = () => {
    const canvas = fgRef.current?.renderer()?.domElement;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "sosyal_ag_analizi.png";
    a.click();
  };

  // --- ALGORITMALAR ---

  const runBfs = () => {
    if (!selectedNode) return alert("Lütfen başlangıç için bir düğüm seçin!");
    clearVisuals();
    const graphInstance = Graph.fromJSON(graph);
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
    setHighlightNodes(Object.keys(dist).map(Number));
  };

  const runAstar = () => {
    if (!selectedNode) return alert("Lütfen başlangıç için bir düğüm seçin!");
    const others = graph.nodes.filter((n) => n.id !== selectedNode.id);
    if (others.length === 0) return alert("Grafikte başka düğüm yok!");
    const targetNode = others[others.length - 1];

    clearVisuals();
    const graphInstance = Graph.fromJSON(graph);
    const path = astar(graphInstance, selectedNode.id, targetNode.id);

    setResult({
      title: `A* Algoritması (${selectedNode.id} -> ${targetNode.id})`,
      data: path || "Yol bulunamadı",
    });
    setHighlightNodes(path || []);
  };

  const runConnected = () => {
    clearVisuals();
    const graphInstance = Graph.fromJSON(graph);
    const output = connectedComponents(graphInstance);
    setResult({
      title: "Bağlı Bileşenler (Connected Components)",
      data: output,
    });
  };

  const runColoring = () => {
    clearVisuals();
    const output = welshPowell(graph);
    setNodeColors(output.coloring);
    setResult({
      title: "Welsh-Powell Renklendirme Tablosu",
      data: output.detailedTables,
    });
  };

  const runCentrality = () => {
    clearVisuals();
    setNodeColors({});

    const nodesWithDegree = graph.nodes.map((node) => {
      const degree = graph.links.filter(
        (l) =>
          (l.source.id ?? l.source) === node.id ||
          (l.target.id ?? l.target) === node.id
      ).length;
      return { ...node, degree };
    });

    nodesWithDegree.sort((a, b) => b.degree - a.degree);

    const top5 = nodesWithDegree.slice(0, 5).map((n) => ({
      Sıra: "#",
      "Kullanıcı ID": n.id,
      "Derece (Bağlantı)": n.degree,
      "Etkileşim Puanı": n.etkileşim,
    }));

    const formattedTop5 = top5.map((item, index) => ({
      ...item,
      Sıra: index + 1,
    }));

    setResult({
      title: "En Etkili 5 Düğüm (Degree Centrality)",
      data: formattedTop5,
    });

    const top5Ids = formattedTop5.map((item) => item["Kullanıcı ID"]);
    setHighlightNodes(top5Ids);
  };

  // --- NODE EKLEME / SİLME ---

  const addNode = () => {
    pushHistory(graph);
    const newId =
      graph.nodes.length > 0
        ? Math.max(
            ...graph.nodes.map((n) => (typeof n.id === "number" ? n.id : 0))
          ) + 1
        : 1;
    const newNode = {
      id: newId,
      aktiflik: parseFloat(Math.random().toFixed(2)),
      etkileşim: Math.floor(Math.random() * 20),
      bagSayisi: 0,
    };
    setGraph({ ...graph, nodes: [...graph.nodes, newNode] });
  };

  const deleteNode = () => {
    if (!selectedNode) return;
    pushHistory(graph);
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

  // Pencereyi Açar
  const handleOpenAddLink = () => {
    if (!selectedNode) {
      alert("Lütfen önce kaynak (başlangıç) düğümünü seçin!");
      return;
    }
    setTargetNodeId(""); // Inputu temizle
    setOpenLinkDialog(true);
  };

  // Pencereyi Kapatır
  const handleCloseLinkDialog = () => {
    setOpenLinkDialog(false);
  };

  // Bağlantıyı Kaydeder
  const saveLink = () => {
    if (!selectedNode) return;

    const targetIdInt = parseInt(targetNodeId);

    // Kontroller
    if (isNaN(targetIdInt)) {
      alert("Lütfen geçerli bir sayı girin.");
      return;
    }
    if (targetIdInt === selectedNode.id) {
      alert("Bir düğümü kendine bağlayamazsınız (Self-loop yasak).");
      return;
    }
    const targetNodeExists = graph.nodes.find((n) => n.id === targetIdInt);
    if (!targetNodeExists) {
      alert(`ID: ${targetIdInt} olan bir kullanıcı bulunamadı!`);
      return;
    }

    // Bağlantı var mı kontrolü
    const exists = graph.links.some((l) => {
      const s = typeof l.source === "object" ? l.source.id : l.source;
      const t = typeof l.target === "object" ? l.target.id : l.target;
      return (
        (s === selectedNode.id && t === targetIdInt) ||
        (s === targetIdInt && t === selectedNode.id)
      );
    });

    if (exists) {
      alert("Bu bağlantı zaten mevcut!");
      return;
    }

    pushHistory(graph);

    // Yeni bağlantı oluştur
    const newLink = {
      source: selectedNode.id,
      target: targetIdInt,
      weight: 1, // Dinamik ağırlık GraphModel'de hesaplanıyor ama veri yapısı için 1 veriyoruz
    };

    setGraph({ ...graph, links: [...graph.links, newLink] });
    setOpenLinkDialog(false);
  };

  // JSON KAYDET
  const saveGraph = () => {
    saveGraphFile(graph);
  };

  // JSON YÜKLE
  const loadGraph = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadGraphFile(file, (newGraph) => {
      setGraph(newGraph);
      setSelectedNode(null);
      clearVisuals();
      setResult(null);
      setHistory([]);
      setFuture([]);
    });
    e.target.value = "";
  };

  const saveCSV = () => {
    saveGraphToCSV(graph);
  };

  const loadCSV = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadGraphFromCSV(file, (newGraph) => {
      setGraph(newGraph);
      setSelectedNode(null);
      clearVisuals();
      setResult(null);
      setHistory([]);
      setFuture([]);
    });
    e.target.value = "";
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
        {/* GRAFİK GÖRÜNÜMÜ */}
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
            onNodeClick={(node) => {
              setSelectedNode(node);
              setSelectedEdge(null);
            }}
            onLinkClick={(link) => {
              setSelectedEdge(link);
              setSelectedNode(null);
            }}
            highlight={highlightNodes}
            nodeColors={nodeColors}
            graphRef={fgRef}
            renameNode={renameNode}
            selectedEdge={selectedEdge}
          />
        </Box>

        {/* SOL ÜST BAŞLIK */}
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
          <Typography
            variant="h6"
            color="primary"
            sx={{ fontWeight: "bold", letterSpacing: 1 }}
          >
            SOSYAL AG ANALIZI
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
          {/* Seçili Düğüm Bilgisi */}
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
              <NodeInfo node={selectedNode} links={graph.links} />
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
              <Typography variant="subtitle1" fontWeight="bold">
                Kontrol Paneli
              </Typography>
            </Box>

            <Box sx={{ p: 2, overflowY: "auto", flex: 1 }}>
              <Controls
                runBfs={runBfs}
                runDfs={runDfs}
                runDijkstra={runDijkstra}
                runAstar={runAstar}
                runConnected={runConnected}
                runColoring={runColoring}
                runCentrality={runCentrality}
                addNode={addNode}
                deleteNode={deleteNode}
                addLink={handleOpenAddLink}
                saveGraph={saveGraph}
                loadGraph={loadGraph}
                saveCSV={saveCSV}
                loadCSV={loadCSV} 
                zoomIn={zoomIn}
                zoomOut={zoomOut}
                zoomToFit={zoomToFit}
                centerGraph={centerGraph}
                undo={undo}
                redo={redo}
                exportPNG={exportPNG}
              />
            </Box>
          </Paper>

          {/* Terminal Çıktısı */}
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
            <Box
              sx={{
                px: 2,
                py: 1,
                bgcolor: "#1a1a1a",
                borderBottom: "1px solid #333",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="caption"
                sx={{ fontFamily: "monospace", color: "#aaa" }}
              >
                TERMINAL ÇIKTISI
              </Typography>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: result ? "#00e676" : "#555",
                }}
              />
            </Box>

            <Box
              sx={{
                p: 2,
                overflow: "auto",
                flex: 1,
                fontFamily: "'Fira Code', 'Consolas', monospace",
                fontSize: "0.85rem",
              }}
            >
              {result ? (
                <>
                  <Typography
                    sx={{ color: "#00e5ff", mb: 1, fontWeight: "bold" }}
                  >
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

        {/* --- BAĞLANTI EKLEME PENCERESİ --- */}
        <Dialog open={openLinkDialog} onClose={handleCloseLinkDialog}>
          <DialogTitle sx={{ bgcolor: "#1a1a1a", color: "#00e5ff" }}>
            Bağlantı Oluştur
          </DialogTitle>
          <DialogContent sx={{ bgcolor: "#1a1a1a", pt: 2 }}>
            <Box
              sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Typography variant="body2" sx={{ color: "#aaa" }}>
                Seçili Düğüm (Kaynak): <strong>ID {selectedNode?.id}</strong>
              </Typography>

              <Typography variant="body2" sx={{ color: "#aaa" }}>
                Hangi ID'li kullanıcı ile bağlamak istiyorsunuz?
              </Typography>

              <TextField
                label="Hedef Kullanıcı ID"
                type="number"
                variant="outlined"
                fullWidth
                autoFocus
                value={targetNodeId}
                onChange={(e) => setTargetNodeId(e.target.value)}
                sx={{
                  input: { color: "white" },
                  label: { color: "#9e9e9e" },
                  fieldset: { borderColor: "#333" },
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ bgcolor: "#1a1a1a", pb: 2, px: 3 }}>
            <Button onClick={handleCloseLinkDialog} color="error">
              İptal
            </Button>
            <Button onClick={saveLink} variant="contained" color="info">
              Bağla
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}
