import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function NodeInfo({ node }) {
  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Düğüm Bilgisi</Typography>
      </AccordionSummary>

      <AccordionDetails>
        {node ? (
          <>
            <Typography>ID: {node.id}</Typography>
            <Typography>Aktiflik: {node.aktiflik}</Typography>
            <Typography>Etkileşim: {node.etkileşim}</Typography>
            <Typography>Bağ Sayısı: {node.bagSayisi}</Typography>
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
