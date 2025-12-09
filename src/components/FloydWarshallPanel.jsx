
import { useState } from "react";

export default function FloydWarshallPanel({ onRun }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  return (
    <div style={{ padding: 10 }}>
      <h3>Floyd-Warshall</h3>

      <input
        placeholder="Başlangıç düğümü"
        value={start}
        onChange={e => setStart(e.target.value)}
      />

      <input
        placeholder="Bitiş düğümü"
        value={end}
        onChange={e => setEnd(e.target.value)}
      />

      <button onClick={() => onRun(start, end)}>
        Çalıştır
      </button>
    </div>
  );
}
