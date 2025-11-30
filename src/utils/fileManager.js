export const saveGraphFile = (graph) => {
  const a = document.createElement("a");
  const file = new Blob([JSON.stringify(graph, null, 2)], {
    type: "application/json"
  });

  a.href = URL.createObjectURL(file);
  a.download = "graph.json";
  a.click();
};

export const loadGraphFile = (file, setGraph) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = JSON.parse(e.target.result);
    setGraph(data);
  };
  reader.readAsText(file);
};
