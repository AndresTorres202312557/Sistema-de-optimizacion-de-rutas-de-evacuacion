import * as fs from 'fs';
import * as path from 'path';

export interface Row {
  Nodo_origen: string;
  Nodo_destino: string;
  Tipo_conexion?: string;
  Piso_origen: number;
  Piso_destino: number;
  Distancia_m: number;
  Altura_m?: number;
  Factor_congestion: number;
  Peso_total?: number;
}

export function leerDatasetExcel(): Row[] {
  // Use 1000-connection clean dataset with only Aula_XXX, Pasillo_XXX, Escalera_XXX
  const jsonPath = path.join(process.cwd(), 'app', 'lib', 'dataset-1000-limpio.json');
  let jsonData;
  
  try {
    console.log(`Attempting to load 1000-connection dataset from: ${jsonPath}`);
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`1000-connection dataset not found at: ${jsonPath}`);
    }
    console.log('1000-connection dataset file exists, loading...');
    jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    console.log(`1000-connection dataset loaded successfully with ${jsonData.length} entries`);
    
    // Dataset already has all necessary connections
    const conexionesPrincipales: any[] = [];
    
    jsonData = [...jsonData, ...conexionesPrincipales];
  } catch (error) {
    console.error('Error loading extended dataset:', error);
    // Fallback to clean dataset  
    const fallbackPath = path.join(process.cwd(), 'app', 'lib', 'dataset-final-limpio.json');
    if (!fs.existsSync(fallbackPath)) {
      throw new Error(`Fallback dataset not found: ${fallbackPath}`);
    }
    jsonData = JSON.parse(fs.readFileSync(fallbackPath, 'utf-8'));
    console.log('Using fallback clean dataset');
  }
  
  const data: Row[] = jsonData.map((row: any) => {
    // Data is already in correct format
    if (!row.Altura_m) row.Altura_m = 0;
    return row as Row;
  });
  
  console.log('Loaded simplified dataset with', data.length, 'connections');
  return data;
}