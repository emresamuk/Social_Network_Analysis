export class Node {
  constructor(id, aktiflik = 0, etkilesim = 0, baglantiSayisi = 0) {
    this.id = id;
    this.aktiflik = parseFloat(aktiflik || 0);
    this.etkilesim = parseFloat(etkilesim || 0);
    this.baglantiSayisi = parseInt(baglantiSayisi || 0);
  }
}

export class Edge {
  constructor(sourceNode, targetNode) {
    this.source = sourceNode;
    this.target = targetNode;
    this.weight = this.calculateWeight();
  }

  // İki düğüm arasındaki benzerliğe göre maliyeti hesaplar
  calculateWeight() {
    const deltaAktiflik = this.source.aktiflik - this.target.aktiflik;
    const deltaEtkilesim = this.source.etkilesim - this.target.etkilesim;
    const deltaBaglanti = this.source.baglantiSayisi - this.target.baglantiSayisi;

    const euclidean = Math.sqrt(
      Math.pow(deltaAktiflik, 2) +
      Math.pow(deltaEtkilesim, 2) +
      Math.pow(deltaBaglanti, 2)
    );

    return 1 + euclidean;
  }
}

export class Graph {
  constructor() {
    this.nodes = []; 
    this.edges = []; 
    this.adjList = new Map();
  }

  addNode(data) {
    const newNode = data instanceof Node 
      ? data 
      : new Node(data.id, data.aktiflik, data.etkilesim, data.bagSayisi); 

    if (!this.nodes.find(n => n.id === newNode.id)) {
      this.nodes.push(newNode);
      this.adjList.set(newNode.id, []);
    }
    return newNode;
  }

  addEdge(sourceId, targetId) {
    const sourceNode = this.nodes.find(n => n.id === sourceId);
    const targetNode = this.nodes.find(n => n.id === targetId);

    if (sourceNode && targetNode) {
      const edge = new Edge(sourceNode, targetNode);
      this.edges.push(edge);
      
      this.adjList.get(sourceId).push({ node: targetNode, weight: edge.weight });
      this.adjList.get(targetId).push({ node: sourceNode, weight: edge.weight });
    }
  }

  // Algoritmaların (BFS, DFS, Dijkstra) kullandığı kritik fonksiyon
  getNeighbors(nodeId) {
    return this.adjList.get(nodeId) || [];
  }
  
  static fromJSON(jsonData) {
    const graphInstance = new Graph();
    
    jsonData.nodes.forEach(n => graphInstance.addNode(n));

    jsonData.links.forEach(l => {
      const sId = (typeof l.source === 'object') ? l.source.id : l.source;
      const tId = (typeof l.target === 'object') ? l.target.id : l.target;
      graphInstance.addEdge(sId, tId);
    });

    return graphInstance;
  }
}