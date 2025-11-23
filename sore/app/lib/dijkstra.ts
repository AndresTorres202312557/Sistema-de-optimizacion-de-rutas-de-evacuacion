import { GraphData } from './graph';

export function dijkstra(G: number[][][], start: number): [number[], number[]] {
  const n = G.length;
  const dist: number[] = Array(n).fill(Infinity);
  const parent: number[] = Array(n).fill(-1);
  dist[start] = 0;

  const pq: [number, number][] = [[0, start]];
  const visited = new Set<number>();

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift()!;
    
    if (visited.has(u)) continue;
    visited.add(u);
    
    if (d > dist[u]) continue;

    for (const [v, weight] of G[u]) {
      if (!visited.has(v) && dist[u] + weight < dist[v]) {
        dist[v] = dist[u] + weight;
        parent[v] = u;
        pq.push([dist[v], v]);
      }
    }
  }

  return [parent, dist];
}

export function reconstruir(parent: number[], goal: number): number[] | null {
  if (goal === -1 || parent[goal] === -1) return null;

  const path: number[] = [];
  let current = goal;
  const visited = new Set<number>();
  
  while (current !== -1 && !visited.has(current)) {
    visited.add(current);
    path.push(current);
    current = parent[current];
  }
  
  if (current === -1) {
    return path.reverse();
  }
  
  return null; // Cycle detected
}

export function calcularRuta(graphData: GraphData, startLabel: string, endLabel?: string): {
  start: number;
  goal: number;
  cost: number;
  rutaIdx: number[];
  rutaLabels: string[];
} | null {
  const { G, labels, w2i, tipos_nodo } = graphData;

  if (!(startLabel in w2i)) return null;

  const start = w2i[startLabel];
  const [parent, dist] = dijkstra(G, start);

  let goal: number;
  if (endLabel) {
    if (!(endLabel in w2i)) return null;
    goal = w2i[endLabel];
    if (dist[goal] === Infinity) return null;
  } else {
    // Find nearest exit
    const exitsIdx = Object.entries(tipos_nodo)
      .filter(([n, t]) => t === "Salida" && n in w2i)
      .map(([n]) => w2i[n]);
    const candidatos = exitsIdx
      .map(e => [e, dist[e]] as [number, number])
      .filter(([e, d]) => d < Infinity);
    if (candidatos.length === 0) {
      // If no exits found, return null
      console.log('No exits found or reachable from start node');
      return null;
    }
    goal = candidatos.reduce((min, curr) => curr[1] < min[1] ? curr : min)[0];
  }

  const rutaIdx = reconstruir(parent, goal);
  if (!rutaIdx) return null;

  const cost = dist[goal];
  const rutaLabels = rutaIdx.map(i => labels[i]);

  return { start, goal, cost, rutaIdx, rutaLabels };
}