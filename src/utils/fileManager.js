// Graf verisini JSON olarak indirir.
export function saveGraphFile(graph) {
  // Veriyi olduğu gibi kaydet 
  const data = JSON.stringify(graph, null, 2);
  const blob = new Blob([data], { type: "application/json" });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `proje2_graph_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}


 // JSON dosyasını okur ve grafiğin bozulmaması için veriyi temizler.
 
export function loadGraphFile(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);

      // Basit doğrulama
      if (!data.nodes || !data.links) {
        throw new Error("Dosya formatı hatalı: 'nodes' veya 'links' eksik.");
      }

      // Düğümleri temizle
      const cleanNodes = data.nodes.map(n => ({
        ...n,
        id: Number(n.id),
        aktiflik: parseFloat(n.aktiflik),
        etkileşim: Number(n.etkileşim || n.etkilesim || 0), // ş veya s kullanımı için
        bagSayisi: Number(n.bagSayisi || 0),
        // Konum bilgisi varsa koru
        x: n.x, 
        y: n.y
      }));

      // Bağlantıları temizle 
      const cleanLinks = data.links.map(l => ({
        ...l,
        // Eğer source/target obje ise ID'sini al, değilse kendisini sayı yap
        source: typeof l.source === 'object' ? Number(l.source.id) : Number(l.source),
        target: typeof l.target === 'object' ? Number(l.target.id) : Number(l.target),
        weight: Number(l.weight || 1)
      }));

      callback({
        ...data,
        nodes: cleanNodes,
        links: cleanLinks
      });

    } catch (error) {
      console.error("JSON Yükleme Hatası:", error);
      alert("Dosya yüklenirken hata oluştu: " + error.message);
    }
  };
  reader.readAsText(file);
}

 // Graf verisini CSV olarak indir.
export const saveGraphToCSV = (graphData) => {
  try {
    const { nodes, links } = graphData;

    // Excel ayıracı (sep=,)
    let csvContent = "sep=,\n"; 
    
    // Başlık
    csvContent += "DugumId,Ozellik_I (Aktiflik),Ozellik_II (Etkilesim),Ozellik_III (Bagl. Sayisi),Komsular\n";

    nodes.forEach((node) => {
      // Anlık komşuları ve bağlantı sayısını hesapla
      const neighborIds = links
        .filter(l => {
          const s = typeof l.source === 'object' ? l.source.id : l.source;
          const t = typeof l.target === 'object' ? l.target.id : l.target;
          return s === node.id || t === node.id;
        })
        .map(l => {
          const s = typeof l.source === 'object' ? l.source.id : l.source;
          const t = typeof l.target === 'object' ? l.target.id : l.target;
          return s === node.id ? t : s;
        });

      const guncelBaglantiSayisi = neighborIds.length;
      const komsularStr = `"${neighborIds.join(",")}"`;

      const row = [
        node.id,
        node.aktiflik,
        node.etkileşim || node.etkilesim || 0,
        guncelBaglantiSayisi,
        komsularStr
      ].join(",");

      csvContent += row + "\n";
    });

    // Türkçe karakterler için BOM ekle
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `proje2_veri_${new Date().toISOString().slice(0, 10)}.csv`;
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
  } catch (err) {
    console.error("CSV Kaydetme Hatası:", err);
    alert("CSV oluşturulurken bir hata oluştu.");
  }
};


// CSV dosyasını okur.
export const loadGraphFromCSV = (file, onLoaded) => {
  if (!file) return;
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const text = e.target.result;
      const lines = text.split("\n");
      
      const newNodes = [];
      const newLinks = [];
      const addedLinks = new Set(); 

      let startIndex = 1;
      if (lines.length > 0 && lines[0].startsWith("sep=")) {
        startIndex = 2;
      }

      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const parts = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (!parts || parts.length < 4) continue;

        const id = parseInt(parts[0]);
        const aktiflik = parseFloat(parts[1]);
        const etkilesim = parseFloat(parts[2]);
        const bagSayisi = parseInt(parts[3]); 
        
        let komsularStr = parts[4] || "";
        komsularStr = komsularStr.replace(/^"|"$/g, ''); 
        const komsular = komsularStr ? komsularStr.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n)) : [];

        newNodes.push({
          id,
          aktiflik,
          etkileşim: etkilesim,
          bagSayisi, 
          x: Math.random() * 400,
          y: Math.random() * 400
        });

        komsular.forEach(targetId => {
          const linkId = id < targetId ? `${id}-${targetId}` : `${targetId}-${id}`;
          if (!addedLinks.has(linkId)) {
            newLinks.push({ source: id, target: targetId, weight: 1 });
            addedLinks.add(linkId);
          }
        });
      }
      onLoaded({ nodes: newNodes, links: newLinks });
    } catch (err) {
      console.error("CSV Okuma Hatası:", err);
      alert("CSV dosyası okunurken hata oluştu.");
    }
  };
  reader.readAsText(file);
};