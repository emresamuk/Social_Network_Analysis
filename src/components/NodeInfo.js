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
            <Typography>Aktiflik: {node.aktiflik.toFixed(2)}</Typography>
            <Typography>Etkileşim: {node.etkileşim}</Typography>
          </>
        ) : (
          <Typography>Klik ile düğüm seçin</Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
