export function saveGraphFile(graph) {
  const data = JSON.stringify(graph, null, 2);
  const blob = new Blob([data], { type: "application/json" });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "graph.json";
  a.click();
}

export function loadGraphFile(file, callback) {
  const reader = new FileReader();
  reader.onload = () => {
    const data = JSON.parse(reader.result);
    callback(data);
  };
  reader.readAsText(file);
}
