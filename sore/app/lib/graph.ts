import { Row } from './data';

export interface GraphData {
  G: number[][][];
  labels: string[];
  w2i: Record<string, number>;
  tipos_nodo: Record<string, string>;
  pisos_nodo: Record<string, Set<number>>;
}

function pesoIntegrado(dist: number, alt: number, factor: number, peso_total?: number): number {
  if (peso_total !== undefined && !isNaN(peso_total)) {
    return peso_total;
  }
  dist = isNaN(dist) ? 0 : dist;
  alt = isNaN(alt) ? 0 : alt;
  factor = isNaN(factor) ? 1 : factor;
  return (dist + alt) * factor;
}

function tipo(n: string): string {
  const s = n.toLowerCase();
  if (s.includes("aula")) return "Aula";
  if (s.includes("pasillo")) return "Pasillo";
  if (s.includes("escala")) return "Escalera";
  if (s.includes("salida")) return "Salida";
  
  // Mark specific exit nodes
  if (n === "Salida_Principal" || n === "Salida_Emergencia") return "Salida";
  return "Otro";
}

export function construirAdy(df: Row[]): GraphData {
  const labels: string[] = [];
  const w2i: Record<string, number> = {};
  const tipos: Record<string, string> = {};
  const pisos_nodo: Record<string, Set<number>> = {};

  const idx = (name: string): number => {
    if (!(name in w2i)) {
      w2i[name] = labels.length;
      labels.push(name);
    }
    return w2i[name];
  };

  const edges: [number, number, number][] = [];
  for (const r of df) {
    const u = idx(r.Nodo_origen);
    const v = idx(r.Nodo_destino);
    const w = pesoIntegrado(r.Distancia_m, r.Altura_m || 0, r.Factor_congestion, r.Peso_total);
    tipos[labels[u]] = tipo(labels[u]);
    tipos[labels[v]] = tipo(labels[v]);
    pisos_nodo[labels[u]] = pisos_nodo[labels[u]] || new Set();
    pisos_nodo[labels[u]].add(r.Piso_origen);
    pisos_nodo[labels[v]] = pisos_nodo[labels[v]] || new Set();
    pisos_nodo[labels[v]].add(r.Piso_destino);
    edges.push([u, v, w]);
  }

  const G: number[][][] = Array(labels.length).fill(0).map(() => []);
  for (const [u, v, w] of edges) {
    G[u].push([v, w]);
    G[v].push([u, w]); // Add reverse edge for undirected graph
  }

  // Ensure all nodes have a type assigned
  for (const label of labels) {
    if (!(label in tipos)) {
      tipos[label] = tipo(label);
    }
  }

  return { G, labels, w2i, tipos_nodo: tipos, pisos_nodo };
}