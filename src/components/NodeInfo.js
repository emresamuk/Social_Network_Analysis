import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function NodeInfo({ node, links = [] }) {
  
  // Düğümün gerçek bağlantı sayısını hesapla
  const realDegree = node && links 
    ? links.filter(l => {
        const s = typeof l.source === 'object' ? l.source.id : l.source;
        const t = typeof l.target === 'object' ? l.target.id : l.target;
        return s === node.id || t === node.id;
      }).length 
    : 0;

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Düğüm Bilgisi</Typography>
      </AccordionSummary>

      <AccordionDetails>
        {node ? (
          <>
            <Typography>ID: <strong>{node.id}</strong></Typography>
            <Typography>Aktiflik: {node.aktiflik}</Typography>
            <Typography>Etkileşim: {node.etkileşim}</Typography>
            <Typography sx={{fontWeight: 'bold' }}>
              Bağ Sayısı: {realDegree}
            </Typography>
          </>
        ) : (
          <Typography color="text.secondary">
            Bir düğüme tıklayın...
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
}