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
            <Grid item xs={6}><Button variant="contained" fullWidth onClick={runBfs}>BFS</Button></Grid>
            <Grid item xs={6}><Button variant="contained" fullWidth onClick={runDfs}>DFS</Button></Grid>
            <Grid item xs={6}><Button variant="contained" fullWidth onClick={runDijkstra}>Dijkstra</Button></Grid>
            <Grid item xs={6}><Button variant="contained" fullWidth onClick={runAstar}>A*</Button></Grid>
            <Grid item xs={6}><Button variant="contained" fullWidth onClick={runConnected}>Komponent</Button></Grid>
            <Grid item xs={6}><Button variant="contained" fullWidth onClick={runColoring}>Renkleme</Button></Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Graf Kontrolleri */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Graf Kontrolleri</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Grid container spacing={1}>
            <Grid item xs={6}><Button variant="outlined" fullWidth onClick={zoomIn}>Yakınlaş</Button></Grid>
            <Grid item xs={6}><Button variant="outlined" fullWidth onClick={zoomOut}>Uzaklaş</Button></Grid>
            <Grid item xs={6}><Button variant="outlined" fullWidth onClick={zoomToFit}>Sığdır</Button></Grid>
            <Grid item xs={6}><Button variant="outlined" fullWidth onClick={centerGraph}>Ortala</Button></Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Düğüm İşlemleri */}
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

      {/* JSON İşlemleri */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Veri İşlemleri</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Button fullWidth variant="outlined" onClick={saveGraph}>JSON Kaydet</Button>
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
