import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function NodeInfo({ node, edge }) {
  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Bilgi Paneli</Typography>
      </AccordionSummary>

      <AccordionDetails>
        {node ? (
          <>
            <Typography>ID: {node.id}</Typography>
            <Typography>Aktiflik: {node.aktiflik}</Typography>
            <Typography>Etkileşim: {node.etkileşim}</Typography>
          </>
        ) : edge ? (
          <>
            <Typography>Edge Bilgisi</Typography>
            <Typography>Kaynak: {edge.source.id ?? edge.source}</Typography>
            <Typography>Hedef: {edge.target.id ?? edge.target}</Typography>
            <Typography>Ağırlık: {edge.weight}</Typography>
          </>
        ) : (
          <Typography color="text.secondary">
            Bir düğüme veya bağlantıya tıklayın...
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
