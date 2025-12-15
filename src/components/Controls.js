import {
  Button,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Controls({
  runBfs,
  runDfs,
  runDijkstra,
  runAstar,
  runConnected,
  runColoring,
  addNode,
  deleteNode,
  addLink,
  saveGraph,
  loadGraph,
  zoomIn,
  zoomOut,
  zoomToFit,
  centerGraph
}) {
  return (
    <Stack spacing={2}>
      {/* Algoritmalar */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Algoritmalar</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={1}>
            <Grid item xs={6}><Button fullWidth variant="contained" onClick={runBfs}>BFS</Button></Grid>
            <Grid item xs={6}><Button fullWidth variant="contained" onClick={runDfs}>DFS</Button></Grid>
            <Grid item xs={6}><Button fullWidth variant="contained" onClick={runDijkstra}>Dijkstra</Button></Grid>
            <Grid item xs={6}><Button fullWidth variant="contained" onClick={runAstar}>A*</Button></Grid>
            <Grid item xs={6}><Button fullWidth variant="contained" onClick={runConnected}>Komponent</Button></Grid>
            <Grid item xs={6}><Button fullWidth variant="contained" onClick={runColoring}>Renkleme</Button></Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Grafik kontrolleri */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Graf Kontrolleri</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={1}>
            <Grid item xs={6}><Button fullWidth variant="outlined" onClick={zoomIn}>Yakınlaş</Button></Grid>
            <Grid item xs={6}><Button fullWidth variant="outlined" onClick={zoomOut}>Uzaklaş</Button></Grid>
            <Grid item xs={6}><Button fullWidth variant="outlined" onClick={zoomToFit}>Sığdır</Button></Grid>
            <Grid item xs={6}><Button fullWidth variant="outlined" onClick={centerGraph}>Ortala</Button></Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Node işlemleri */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Düğüm İşlemleri</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={1}>
            <Grid item xs={6}><Button fullWidth variant="outlined" onClick={addNode}>Düğüm Ekle</Button></Grid>
            <Grid item xs={6}><Button fullWidth variant="outlined" color="error" onClick={deleteNode}>Sil</Button></Grid>
            <Grid item xs={12}><Button fullWidth variant="outlined" onClick={addLink}>Bağ Ekle</Button></Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* JSON işlemleri */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Veri İşlemleri</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Button fullWidth variant="outlined" onClick={saveGraph}>
                JSON Kaydet
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button fullWidth variant="outlined" component="label">
                Yükle
                <input hidden type="file" accept="application/json" onChange={loadGraph} />
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
}
