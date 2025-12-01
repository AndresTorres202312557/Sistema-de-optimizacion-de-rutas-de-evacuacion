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
      if (numero >= 100 && numero < 200) return 1;
      if (numero >= 200 && numero < 300) return 2;
      if (numero >= 300 && numero < 400) return 3;
      if (numero >= 400 && numero < 500) return 4;
      return 1; // Por defecto
    }
    if (nodeId.startsWith('Pasillo_')) {
      const numero = parseInt(nodeId.split('_')[1]);
      if (numero >= 100 && numero < 200) return 1;
      if (numero >= 200 && numero < 300) return 2;
      if (numero >= 300 && numero < 400) return 3;
      if (numero >= 400 && numero < 500) return 4;
      return 1; // Por defecto
    }
    if (nodeId.startsWith('Escalera_')) {
      // Las escaleras conectan pisos, no pertenecen a uno específico
      // Usaremos el piso más bajo que conecta para posicionamiento
      return 1;
    }
    if (nodeId.startsWith('Salida_')) {
      return 1; // Las salidas generalmente están en planta baja
    }
    return 1; // Por defecto piso 1
  };

  // Generar posiciones para los nodos evitando sobreposición
  const generateNodePositions = (nodes: string[]): Node[] => {
    const nodeMap = new Map<string, Node>();
    const usedPositions = new Set<string>();
    
    // Agrupar nodos por piso con validación estricta
    const nodesByPiso = new Map<number, string[]>();
    
    // Inicializar mapas para cada piso
    for (let i = 1; i <= 4; i++) {
      nodesByPiso.set(i, []);
    }
    
    nodes.forEach(nodeId => {
      const tipo = getNodeType(nodeId);
      
      // Las escaleras se manejan por separado, no van en ningún piso específico
      if (tipo === 'escalera') {
        return;
      }
      
      const piso = getPiso(nodeId);
      
      nodesByPiso.get(piso)!.push(nodeId);
    });
    
    // Posicionar nodos por piso aprovechando mejor el espacio disponible
    Array.from(nodesByPiso.entries()).forEach(([piso, pisoNodes]) => {
      // Coordenadas que coinciden exactamente con los rectángulos de los pisos
      const pisoY = 80 + (piso - 1) * 320 - 30; // Misma fórmula que los rectángulos
      const pisoTop = pisoY;
      const pisoBottom = pisoY + 280;
      const pisoLeft = 30;
      const pisoRight = 30 + 1720;
      
      // Separar por tipos para mejor organización
      const aulas = pisoNodes.filter(n => getNodeType(n) === 'aula');
      const pasillos = pisoNodes.filter(n => getNodeType(n) === 'pasillo');
      const salidas = pisoNodes.filter(n => getNodeType(n) === 'salida');
      
      // Posicionar aulas asegurando que estén dentro del recuadro del piso
      aulas.forEach((nodeId, index) => {
        const colsPerRow = 16; // Más aulas por fila
        const col = index % colsPerRow;
        const row = Math.floor(index / colsPerRow);
        const x = pisoLeft + 60 + col * 100; // Dentro del límite izquierdo y derecho
        const y = pisoTop + 50 + row * 35; // Dentro del límite superior e inferior
        
        nodeMap.set(nodeId, {
          id: nodeId,
          x,
          y,
          type: 'aula',
          piso
        });
      });
      
      // Posicionar pasillos optimizando el espacio disponible
      pasillos.forEach((nodeId, index) => {
        const rowsPerCol = 6; // Máximo pasillos por columna
        const row = index % rowsPerCol;
        const col = Math.floor(index / rowsPerCol);
        const x = pisoLeft + 40 + col * 80; // Lado izquierdo dentro del límite
        const y = pisoTop + 40 + row * 35; // Distribución vertical dentro del límite
        
        nodeMap.set(nodeId, {
          id: nodeId,
          x,
          y,
          type: 'pasillo',
          piso
        });
      });
      
      // Posicionar salidas en el piso 1
      if (piso === 1) {
        salidas.forEach((nodeId, index) => {
          const x = pisoLeft + 400 + index * 200;
          const y = pisoBottom - 60; // Parte inferior del recuadro del piso 1
          
          nodeMap.set(nodeId, {
            id: nodeId,
            x,
            y,
            type: 'salida',
            piso
          });
        });
      }
    });    // Posicionar escaleras entre pisos según su nombre
    const todasEscaleras = nodes.filter(n => getNodeType(n) === 'escalera');
    todasEscaleras.forEach((nodeId, index) => {
      let yPos = 0;
      
      // Determinar posición Y según el nombre de la escalera con nuevo espaciado
      if (nodeId.includes('1_2') || nodeId.includes('Escalera_1')) {
        // Entre piso 1 y 2
        yPos = 80 + (1 - 1) * 320 + 260; // Final del piso 1
      } else if (nodeId.includes('2_3') || nodeId.includes('Escalera_2')) {
        // Entre piso 2 y 3
        yPos = 80 + (2 - 1) * 320 + 260; // Final del piso 2
      } else if (nodeId.includes('3_4') || nodeId.includes('Escalera_3')) {
        // Entre piso 3 y 4
        yPos = 80 + (3 - 1) * 320 + 260; // Final del piso 3
      } else {
        // Escaleras genéricas entre piso 1 y 2
        yPos = 80 + (1 - 1) * 320 + 260;
      }
      
      const x = 1800 + (index % 3) * 80; // Lado derecho, múltiples columnas
      
      nodeMap.set(nodeId, {
        id: nodeId,
        x,
        y: yPos,
        type: 'escalera',
        piso: 1 // Piso base para referencia
      });
    });
    
    return Array.from(nodeMap.values());
  };

  // Extraer TODOS los nodos únicos del dataset para mostrar el grafo completo
  const allNodesSet = new Set<string>();
  
  // Agregar todos los nodos de todas las conexiones
  allConnections.forEach(conn => {
    allNodesSet.add(conn.Nodo_origen);
    allNodesSet.add(conn.Nodo_destino);
  });
  
  // También agregar los nodos de la ruta por si acaso
  route.forEach(nodeId => allNodesSet.add(nodeId));
  
  const allNodes = Array.from(allNodesSet);
  const nodes = generateNodePositions(allNodes);
  
  // Crear aristas de la ruta principal
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
  
  // Crear aristas disponibles (todas las conexiones que no están en la ruta)
  const availableEdges: Edge[] = [];
  allConnections.forEach(conn => {
    const isInRoute = routeEdges.some(edge => 
      (edge.from === conn.Nodo_origen && edge.to === conn.Nodo_destino) ||
      (edge.from === conn.Nodo_destino && edge.to === conn.Nodo_origen)
    );
    
    if (!isInRoute && allNodesSet.has(conn.Nodo_origen) && allNodesSet.has(conn.Nodo_destino)) {
      availableEdges.push({
        from: conn.Nodo_origen,
        to: conn.Nodo_destino,
        type: conn.Tipo_conexion
      });
    }
  });

  // Función para obtener el color del nodo (según las imágenes)
  const getNodeColor = (type: string, isStart: boolean, isEnd: boolean): string => {
    if (isStart) return '#FF4444'; // Rojo brillante para punto de inicio
    if (isEnd) return '#00BFFF'; // Azul cielo para punto de destino
    
    switch (type) {
      case 'aula': return '#FFD700'; // Amarillo dorado para aulas
      case 'pasillo': return '#90EE90'; // Verde claro para pasillos
      case 'escalera': return '#4169E1'; // Azul real para escaleras
      case 'salida': return '#FF69B4'; // Rosa para salidas
      default: return '#D3D3D3'; // Gris claro
    }
  };

  // Función para obtener el color de la arista (ruta seleccionada vs disponibles)
  const getEdgeColor = (type: string, isSelectedRoute: boolean = true): string => {
    if (isSelectedRoute) {
      return '#FF4500'; // Naranja/rojo para la ruta seleccionada (como en las imágenes)
    }
    return '#E0E0E0'; // Gris claro para conexiones disponibles
  };

  const width = 2200;
  const height = 1500; // Aumentado para mejor distribución

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Visualización de la Ruta ({route.length} nodos)</h3>
      
      {/* Leyenda del Grafo */}
      <div className="bg-white border border-gray-300 rounded-lg p-4 mb-4">
        <h4 className="font-bold text-lg mb-3 text-gray-800">Leyenda del Grafo</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tipos de Nodos */}
          <div>
            <h5 className="font-semibold text-gray-700 mb-2">Tipos de Nodos:</h5>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{backgroundColor: '#FF4444'}}></div>
                <span className="text-sm text-gray-800 font-medium">Punto de Inicio</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{backgroundColor: '#00BFFF'}}></div>
                <span className="text-sm text-gray-800 font-medium">Punto de Destino</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{backgroundColor: '#FFD700'}}></div>
                <span className="text-sm text-gray-800 font-medium">Aulas en la ruta</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{backgroundColor: '#90EE90'}}></div>
                <span className="text-sm text-gray-800 font-medium">Pasillos en la ruta</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{backgroundColor: '#4169E1'}}></div>
                <span className="text-sm text-gray-800 font-medium">Escaleras en la ruta</span>
              </div>
            </div>
          </div>

          {/* Información de la Ruta */}
          <div>
            <h5 className="font-semibold text-gray-700 mb-2">Información de la Ruta:</h5>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-1 bg-orange-500 rounded"></div>
                <span className="text-sm text-gray-800 font-medium">Ruta de evacuación (seguir esta línea)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-gray-800 text-white text-xs flex items-center justify-center font-bold">1</div>
                <span className="text-sm text-gray-800 font-medium">Números indican orden de recorrido</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-300 border border-gray-400 opacity-60"></div>
                <span className="text-sm text-gray-800 font-medium">Nodos disponibles (sin etiquetas)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-blue-600">💡</span>
            <span className="text-sm font-bold text-blue-900">Cómo leer el grafo:</span>
          </div>
          <p className="text-sm text-blue-900 mt-1 font-medium">
            Sigue los números en orden (1 → 2 → 3...) siguiendo las líneas naranjas gruesas para encontrar la ruta óptima de evacuación.
          </p>
        </div>
      </div>

      {/* SVG del grafo */}
      <div className="border-2 border-gray-300 rounded-lg bg-white shadow-inner w-full overflow-hidden">
        <svg width="100%" height="700" className="bg-gradient-to-br from-blue-50 to-indigo-50" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMinYMin meet">
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

          {/* Dibujar conexiones disponibles (fondo) */}
          {availableEdges.map((edge, index) => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            
            if (!fromNode || !toNode) return null;
            
            return (
              <line
                key={`available-edge-${index}`}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={getEdgeColor(edge.type, false)}
                strokeWidth="1"
                opacity="0.3"
              />
            );
          })}

          {/* Dibujar aristas de la ruta seleccionada (primer plano) */}
          {routeEdges.map((edge, index) => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            
            if (!fromNode || !toNode) return null;
            
            return (
              <line
                key={`route-edge-${index}`}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={getEdgeColor(edge.type, true)}
                strokeWidth="4"
                markerEnd="url(#arrowhead)"
              />
            );
          })}

          {/* Dibujar separadores de piso */}
          {Array.from(new Set(nodes.map(n => n.piso))).sort().filter(piso => piso <= 4).map(piso => (
            <g key={`piso-${piso}`}>
              <rect
                x={30}
                y={80 + (piso - 1) * 320 - 30}
                width={1720}
                height={280}
                fill="rgba(240, 248, 255, 0.3)"
                stroke="rgba(70, 130, 180, 0.5)"
                strokeWidth="2"
                strokeDasharray="8,4"
                rx="8"
              />
              <rect
                x={30}
                y={80 + (piso - 1) * 320 - 30}
                width={120}
                height={30}
                fill="rgba(70, 130, 180, 0.8)"
                rx="6"
              />
              <text
                x={90}
                y={80 + (piso - 1) * 320 - 10}
                fontSize="16"
                fill="white"
                textAnchor="middle"
                className="font-bold"
              >
                Piso {piso}
              </text>
            </g>
          ))}

          {/* Dibujar todos los nodos */}
          {nodes.map((node, index) => {
            const isStart = route[0] === node.id;
            const isEnd = route[route.length - 1] === node.id;
            const isInRoute = route.includes(node.id);
            const color = getNodeColor(node.type, isStart, isEnd);
            const routeIndex = route.indexOf(node.id);
            
            return (
              <g key={node.id}>
                {/* Sombra solo para nodos en la ruta */}
                {isInRoute && (
                  <circle
                    cx={node.x + 3}
                    cy={node.y + 3}
                    r="22"
                    fill="rgba(0,0,0,0.15)"
                  />
                )}
                
                {/* Círculo principal del nodo */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isInRoute ? "20" : "12"}
                  fill={isInRoute ? color : "#E5E7EB"}
                  stroke={isInRoute ? "#333" : "#9CA3AF"}
                  strokeWidth={isInRoute ? "3" : "1"}
                  opacity={isInRoute ? 1 : 0.6}
                />
                
                {/* Solo agregar texto a nodos de la ruta */}
                {isInRoute && (
                  <>
                    {/* Número de secuencia */}
                    <text
                      x={node.x}
                      y={node.y + 7}
                      textAnchor="middle"
                      fontSize="16"
                      fill={isStart || isEnd ? "#FFF" : "#000"}
                      className="font-bold"
                    >
                      {routeIndex + 1}
                    </text>
                    
                    {/* Etiqueta del nodo */}
                    <text
                      x={node.x}
                      y={node.y - 35}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#333"
                      className="font-semibold"
                    >
                      {node.id.replace('_', ' ')}
                    </text>
                    
                    {/* Indicador de piso (solo para nodos que no sean escaleras) */}
                    {node.type !== 'escalera' && (
                      <text
                        x={node.x}
                        y={node.y + 45}
                        textAnchor="middle"
                        fontSize="9"
                        fill="#666"
                        className="font-medium"
                      >
                        Piso {node.piso}
                      </text>
                    )}
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* Información de la Ruta de Evacuación */}
      <div className="bg-white border border-gray-300 rounded-lg p-4 mt-4">
        <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
          📋 Información de la Ruta de Evacuación
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <h5 className="font-semibold text-blue-800 text-sm">Total de Pasos</h5>
            <p className="text-2xl font-bold text-blue-600">{route.length}</p>
            <span className="text-xs text-blue-600">nodos a recorrer</span>
          </div>
          
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
            <h5 className="font-semibold text-green-800 text-sm">Escaleras Usadas</h5>
            <p className="text-2xl font-bold text-green-600">{route.filter(n => n.startsWith('Escalera_')).length}</p>
            <span className="text-xs text-green-600">cambios de nivel</span>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg">
            <h5 className="font-semibold text-purple-800 text-sm">Pisos Atravesados</h5>
            <p className="text-2xl font-bold text-purple-600">{new Set(route.map(n => getPiso(n))).size}</p>
            <span className="text-xs text-purple-600">niveles del edificio</span>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
            <h5 className="font-semibold text-orange-800 text-sm">Aulas Atravesadas</h5>
            <p className="text-2xl font-bold text-orange-600">{route.filter(n => n.startsWith('Aula_')).length}</p>
            <span className="text-xs text-orange-600">espacios principales</span>
          </div>
        </div>

        {/* Recorrido Paso a Paso */}
        <div className="mt-4">
          <h5 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            🗺️ Recorrido Paso a Paso:
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
            {route.map((node, index) => {
              const nodeType = getNodeType(node);
              const piso = getPiso(node);
              
              let bgColor = 'bg-gray-50 border-gray-200 text-gray-700';
              let icon = '📍';
              
              if (index === 0) {
                bgColor = 'bg-red-50 border-red-200 text-red-800';
                icon = '🚩';
              } else if (index === route.length - 1) {
                bgColor = 'bg-green-50 border-green-200 text-green-800';
                icon = '🎯';
              } else if (nodeType === 'escalera') {
                bgColor = 'bg-blue-50 border-blue-200 text-blue-800';
                icon = '🏗️';
              } else if (nodeType === 'aula') {
                bgColor = 'bg-yellow-50 border-yellow-200 text-yellow-800';
                icon = '🚪';
              } else if (nodeType === 'pasillo') {
                bgColor = 'bg-green-50 border-green-200 text-green-700';
                icon = '➡️';
              }
              
              return (
                <div
                  key={index}
                  className={`p-3 border-2 rounded-lg ${bgColor} flex items-center justify-between`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{icon}</span>
                    <div>
                      <span className="font-bold text-sm">{index + 1}. {node.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <span className="text-xs font-medium opacity-75">Piso {piso}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}