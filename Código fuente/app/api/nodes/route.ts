import { NextResponse } from 'next/server';
import path from 'path';
import { leerDatasetExcel } from '../../lib/data';
import { construirAdy } from '../../lib/graph';

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

export async function GET() {
  try {
    const graph = loadGraphData();
    const nodes = Object.keys(graph.w2i).sort();
    const nodeTypes = graph.tipos_nodo;
    
    // Function to sort nodes with natural number ordering
    const naturalSort = (a: string, b: string) => {
      const regex = /(\d+)|(\D+)/g;
      const aParts = a.match(regex) || [];
      const bParts = b.match(regex) || [];
      
      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aPart = aParts[i] || '';
        const bPart = bParts[i] || '';
        
        const aNum = parseInt(aPart);
        const bNum = parseInt(bPart);
        
        // If both parts are numbers, compare numerically
        if (!isNaN(aNum) && !isNaN(bNum)) {
          if (aNum !== bNum) return aNum - bNum;
        } else {
          // Otherwise compare as strings
          const cmp = aPart.localeCompare(bPart);
          if (cmp !== 0) return cmp;
        }
      }
      return 0;
    };
    
    // Group by type and sort each group
    const grouped: Record<string, string[]> = {};
    for (const [node, type] of Object.entries(nodeTypes) as [string, string][]) {
      if (!grouped[type]) grouped[type] = [];
      grouped[type].push(node);
    }
    
    // Sort nodes within each group using natural sort
    for (const type in grouped) {
      grouped[type].sort(naturalSort);
    }
    
    // Sort group keys for consistent ordering
    const sortedGrouped: Record<string, string[]> = {};
    Object.keys(grouped).sort().forEach(key => {
      sortedGrouped[key] = grouped[key];
    });
    
    return NextResponse.json({
      nodes,
      grouped: sortedGrouped,
      total: nodes.length
    });
  } catch (error) {
    console.error('Error in /api/nodes:', error);
    return NextResponse.json({ error: `Error interno del servidor: ${error.message}` }, { status: 500 });
  }
}