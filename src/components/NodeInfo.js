import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function NodeInfo({ node }) {
  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Düğüm Bilgisi</Typography>
      </AccordionSummary>

      <AccordionDetails>
        {node ? (
          <>
            <Typography>ID: {node.id}</Typography>
          </>
        ) : (
          <Typography>Bir düğüme tıklayın...</Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
