import { NextRequest, NextResponse } from 'next/server';
import { leerDatasetExcel } from '../../lib/data';
import { construirAdy } from '../../lib/graph';
import { calcularRuta } from '../../lib/dijkstra';

let graphData: any = null;

function loadGraphData() {
  if (!graphData) {
    try {
      const df = leerDatasetExcel();
      graphData = construirAdy(df);
      console.log('Graph loaded successfully with', Object.keys(graphData.w2i).length, 'nodes');
    } catch (error) {
      console.error('Error loading graph data:', error);
      throw error;
    }
  }
  return graphData;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { start, end } = body;
    console.log('Calculating route from', start, 'to', end);
    
    const graph = loadGraphData();
    
    // Check if start exists
    if (!(start in graph.w2i)) {
      console.log('Start node not found:', start);
      return NextResponse.json({ error: `Punto de inicio "${start}" no encontrado` }, { status: 404 });
    }
    
    if (end && !(end in graph.w2i)) {
      console.log('End node not found:', end);
      return NextResponse.json({ error: `Punto de destino "${end}" no encontrado` }, { status: 404 });
    }
    
    const result = calcularRuta(graph, start, end);
    console.log('Route calculation result:', result ? 'Success' : 'Failed');
    
    if (!result) {
      return NextResponse.json({ error: 'No se pudo calcular una ruta válida' }, { status: 404 });
    }
    
    // Agregar las conexiones para la visualización
    const df = leerDatasetExcel();
    const connections = df.map(row => ({
      Nodo_origen: row.Nodo_origen,
      Nodo_destino: row.Nodo_destino,
      Tipo_conexion: row.Tipo_conexion || 'Conexión',
      Piso_origen: row.Piso_origen,
      Piso_destino: row.Piso_destino
    }));
    
    return NextResponse.json({
      ...result,
      connections
    });
  } catch (error) {
    console.error('Error in route calculation:', error);
    return NextResponse.json({ error: `Error interno del servidor: ${error.message}` }, { status: 500 });
  }
}