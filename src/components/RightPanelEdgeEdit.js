import { TextField, Button, Stack } from "@mui/material";

export default function RightPanelEdgeEdit({ selectedEdge, updateWeight }) {
  if (!selectedEdge) return null;

  return (
    <Stack spacing={2} style={{ padding: 10 }}>
      <TextField
        label="Ağırlık"
        type="number"
        defaultValue={selectedEdge.weight ?? 1}
        onChange={(e) => updateWeight(selectedEdge.id, e.target.value)}
      />
    </Stack>
  );
}
