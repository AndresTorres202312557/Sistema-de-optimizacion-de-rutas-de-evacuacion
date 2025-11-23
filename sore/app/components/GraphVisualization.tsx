import React from 'react';

interface Node {
  id: string;
  x: number;
  y: number;
  type: 'aula' | 'pasillo' | 'escalera' | 'salida';
  piso: number;
}

interface Edge {
  from: string;
  to: string;
  type: string;
}

interface GraphVisualizationProps {
  route: string[];
  allConnections: Array<{
    Nodo_origen: string;
    Nodo_destino: string;
    Tipo_conexion: string;
    Piso_origen: number;
    Piso_destino: number;
  }>;
}

export default function GraphVisualization({ route, allConnections }: GraphVisualizationProps) {
  // Función para determinar el tipo de nodo
  const getNodeType = (nodeId: string): 'aula' | 'pasillo' | 'escalera' | 'salida' => {
    if (nodeId.startsWith('Aula_')) return 'aula';
    if (nodeId.startsWith('Pasillo_')) return 'pasillo';
    if (nodeId.startsWith('Escalera_')) return 'escalera';
    if (nodeId.startsWith('Salida_')) return 'salida';
    return 'pasillo';
  };

  // Función para obtener el piso de un nodo
  const getPiso = (nodeId: string): number => {
    if (nodeId.startsWith('Aula_')) {
      const numero = parseInt(nodeId.split('_')[1]);
      return Math.floor(numero / 100);
    }
    if (nodeId.startsWith('Pasillo_')) {
      const numero = parseInt(nodeId.split('_')[1]);
      if (numero <= 20) return 1;
      if (numero <= 40) return 2;
      if (numero <= 60) return 3;
      if (numero <= 80) return 4;
      return 5;
    }
    return 1; // Por defecto piso 1
  };

  // Generar posiciones para los nodos con mejor distribución
  const generateNodePositions = (nodes: string[]): Node[] => {
    const nodeMap = new Map<string, Node>();
    
    // Agrupar nodos por piso
    const nodesByPiso = new Map<number, string[]>();
    nodes.forEach(nodeId => {
      const piso = getPiso(nodeId);
      if (!nodesByPiso.has(piso)) {
        nodesByPiso.set(piso, []);
      }
      nodesByPiso.get(piso)!.push(nodeId);
    });
    
    // Posicionar nodos por piso de manera más espaciada
    Array.from(nodesByPiso.entries()).forEach(([piso, pisoNodes]) => {
      const pisoY = 100 + (piso - 1) * 200; // Más espacio vertical entre pisos
      
      pisoNodes.forEach((nodeId, index) => {
        const type = getNodeType(nodeId);
        let x = 0;
        let y = pisoY;
        
        if (type === 'aula') {
          // Distribuir aulas en filas
          const aulaIndex = pisoNodes.filter(n => getNodeType(n) === 'aula').indexOf(nodeId);
          x = 100 + (aulaIndex % 6) * 120; // 6 aulas por fila
          y = pisoY + Math.floor(aulaIndex / 6) * 50;
        } else if (type === 'pasillo') {
          // Pasillos en el centro
          const pasilloIndex = pisoNodes.filter(n => getNodeType(n) === 'pasillo').indexOf(nodeId);
          x = 400 + (pasilloIndex % 4) * 80;
          y = pisoY - 30;
        } else if (type === 'escalera') {
          // Escaleras a la derecha
          const escaleraIndex = pisoNodes.filter(n => getNodeType(n) === 'escalera').indexOf(nodeId);
          x = 750 + escaleraIndex * 60;
          y = pisoY;
        } else if (type === 'salida') {
          // Salidas en la parte inferior
          const salidaIndex = nodes.filter(n => getNodeType(n) === 'salida').indexOf(nodeId);
          x = 200 + salidaIndex * 200;
          y = 50;
        }
        
        nodeMap.set(nodeId, {
          id: nodeId,
          x,
          y,
          type,
          piso
        });
      });
    });
    
    return Array.from(nodeMap.values());
  };

  // Extraer todos los nodos únicos de la ruta
  const allNodes = Array.from(new Set(route));
  const nodes = generateNodePositions(allNodes);
  
  // Crear aristas de la ruta
  const routeEdges: Edge[] = [];
  for (let i = 0; i < route.length - 1; i++) {
    const connection = allConnections.find(
      conn => 
        (conn.Nodo_origen === route[i] && conn.Nodo_destino === route[i + 1]) ||
        (conn.Nodo_origen === route[i + 1] && conn.Nodo_destino === route[i])
    );
    
    routeEdges.push({
      from: route[i],
      to: route[i + 1],
      type: connection?.Tipo_conexion || 'Conexión'
    });
  }

  // Función para obtener el color del nodo
  const getNodeColor = (type: string, isStart: boolean, isEnd: boolean): string => {
    if (isStart) return '#FF6B6B'; // Rojo para inicio
    if (isEnd) return '#4ECDC4'; // Verde azulado para fin
    
    switch (type) {
      case 'aula': return '#FFD93D'; // Amarillo
      case 'pasillo': return '#6BCF7F'; // Verde
      case 'escalera': return '#4D96FF'; // Azul
      case 'salida': return '#9B59B6'; // Púrpura
      default: return '#95A5A6'; // Gris
    }
  };

  // Función para obtener el color de la arista
  const getEdgeColor = (type: string): string => {
    switch (type) {
      case 'Puerta': return '#E74C3C'; // Rojo
      case 'Pasillo': return '#2ECC71'; // Verde
      case 'Escalera': return '#3498DB'; // Azul
      default: return '#34495E'; // Gris oscuro
    }
  };

  const width = 1200;
  const height = 800;

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Visualización de la Ruta ({route.length} nodos)</h3>
      
      {/* Leyenda */}
      <div className="mb-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span>Inicio</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-teal-500"></div>
          <span>Destino</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
          <span>Aulas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span>Pasillos</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          <span>Escaleras</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-purple-500"></div>
          <span>Salidas</span>
        </div>
      </div>

      {/* SVG del grafo */}
      <div className="border border-gray-300 rounded overflow-auto max-h-96">
        <svg width={width} height={height} className="bg-gray-50" viewBox={`0 0 ${width} ${height}`}>
          {/* Definir marcadores para las flechas */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#333"
              />
            </marker>
          </defs>

          {/* Dibujar aristas (conexiones) */}
          {routeEdges.map((edge, index) => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            
            if (!fromNode || !toNode) return null;
            
            return (
              <line
                key={`edge-${index}`}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={getEdgeColor(edge.type)}
                strokeWidth="3"
                markerEnd="url(#arrowhead)"
              />
            );
          })}

          {/* Dibujar separadores de piso */}
          {[1, 2, 3, 4].map(piso => (
            <g key={`piso-${piso}`}>
              <rect
                x={50}
                y={100 + (piso - 1) * 200 - 40}
                width={width - 100}
                height={180}
                fill={`rgba(${100 + piso * 30}, ${150 + piso * 20}, 255, 0.1)`}
                stroke={`rgba(${100 + piso * 30}, ${150 + piso * 20}, 255, 0.3)`}
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              <text
                x={70}
                y={100 + (piso - 1) * 200 - 10}
                fontSize="14"
                fill="#666"
                className="font-bold"
              >
                Piso {piso}
              </text>
            </g>
          ))}

          {/* Dibujar nodos */}
          {nodes.map((node, index) => {
            const isStart = route[0] === node.id;
            const isEnd = route[route.length - 1] === node.id;
            const color = getNodeColor(node.type, isStart, isEnd);
            const routeIndex = route.indexOf(node.id);
            
            return (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="16"
                  fill={color}
                  stroke="#333"
                  strokeWidth="2"
                />
                {routeIndex >= 0 && (
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#fff"
                    className="font-bold"
                  >
                    {routeIndex + 1}
                  </text>
                )}
                <text
                  x={node.x}
                  y={node.y - 25}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#333"
                  className="font-semibold"
                >
                  {node.id}
                </text>
                <text
                  x={node.x}
                  y={node.y + 35}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#666"
                >
                  P{node.piso}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* Estadísticas de la ruta */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-semibold text-blue-800">Pasos totales</h4>
          <p className="text-2xl font-bold text-blue-600">{route.length}</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <h4 className="font-semibold text-green-800">Escaleras usadas</h4>
          <p className="text-2xl font-bold text-green-600">{route.filter(n => n.startsWith('Escalera_')).length}</p>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <h4 className="font-semibold text-purple-800">Pisos atravesados</h4>
          <p className="text-2xl font-bold text-purple-600">{new Set(route.map(n => getPiso(n))).size}</p>
        </div>
      </div>

      {/* Información de la ruta */}
      <div className="mt-4">
        <h4 className="font-semibold">Secuencia de la ruta:</h4>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
          {route.map((node, index) => {
            const nodeType = getNodeType(node);
            const piso = getPiso(node);
            let bgColor = 'bg-gray-100 text-gray-800';
            
            if (index === 0) bgColor = 'bg-red-100 text-red-800';
            else if (index === route.length - 1) bgColor = 'bg-green-100 text-green-800';
            else if (nodeType === 'escalera') bgColor = 'bg-blue-100 text-blue-800';
            else if (nodeType === 'aula') bgColor = 'bg-yellow-100 text-yellow-800';
            
            return (
              <div
                key={index}
                className={`px-3 py-2 rounded-md text-sm ${bgColor} flex justify-between items-center`}
              >
                <span className="font-medium">{index + 1}. {node}</span>
                <span className="text-xs opacity-75">P{piso}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}