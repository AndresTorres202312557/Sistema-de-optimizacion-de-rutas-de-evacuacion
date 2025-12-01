import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { leerDatasetExcel } from '../../lib/data';
import { construirAdy } from '../../lib/graph';
import { calcularRuta, dijkstra } from '../../lib/dijkstra';

let graphData: any = null;

function loadGraphData() {
  if (!graphData) {
    try {
      const df = leerDatasetExcel();
      graphData = construirAdy(df);
    } catch (error) {
      throw error;
    }
  }
  return graphData;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { start, end } = body;
    const graph = loadGraphData();
    
    // Debug: check if start exists
    if (!(start in graph.w2i)) {
      return NextResponse.json({ error: `Punto de inicio "${start}" no encontrado. Nodos disponibles: ${Object.keys(graph.w2i).slice(0, 10).join(', ')}...` }, { status: 404 });
    }
    
    if (end && !(end in graph.w2i)) {
      return NextResponse.json({ error: `Punto de destino "${end}" no encontrado. Nodos disponibles: ${Object.keys(graph.w2i).slice(0, 10).join(', ')}...` }, { status: 404 });
    }
    
    const result = calcularRuta(graph, start, end);
    if (!result) {
      // Debug: check why
      const startIdx = graph.w2i[start];
      const endIdx = end ? graph.w2i[end] : null;
      const [parent, dist] = dijkstra(graph.G, startIdx);
      const distToEnd = endIdx !== null ? dist[endIdx] : 'N/A';
      return NextResponse.json({ error: `No se pudo calcular una ruta válida. Distancia a destino: ${distToEnd}` }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}