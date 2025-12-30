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
  runCentrality,
  addNode,
  deleteNode,
  addLink,
  removeLink,
  saveGraph,
  loadGraph,
  saveCSV, 
  loadCSV, 
  zoomIn,
  zoomOut,
  zoomToFit,
  generateRandomGraph,
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
            <Grid item xs={6}> <Button fullWidth variant="contained" onClick={runCentrality}> En Etkili Düğümler</Button></Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#d3d3d3ff' }}>
           Test Verisi Oluşturma
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={1}>
            
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Button fullWidth variant="outlined"  size="small" onClick={() => generateRandomGraph(15)}>
                  Küçük (15)
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button fullWidth variant="outlined"  size="small" onClick={() => generateRandomGraph(75)}>
                  Orta (75)
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button fullWidth variant="outlined"  size="small" onClick={() => generateRandomGraph(100)}>
                  Büyük (100)
                </Button>
              </Grid>
            </Grid>
          </Stack>
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
            <Grid item xs={6}><Button fullWidth variant="outlined" color="error" onClick={deleteNode}>Düğüm Sil</Button></Grid>
            <Grid item xs={12}><Button fullWidth variant="outlined" onClick={addLink}>Bağ Ekle</Button></Grid>
            <Grid item xs={12}><Button fullWidth variant="outlined" color="error" onClick={removeLink}>Bağ Sil</Button></Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Veri İşlemleri (JSON ve CSV) */}
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
                JSON Yükle
                <input hidden type="file" accept="application/json" onChange={loadGraph} />
              </Button>
            </Grid>
            
            <Grid item xs={6}>
              <Button fullWidth variant="outlined" component="label" onClick={saveCSV}>
                CSV Kaydet
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
}

