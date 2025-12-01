'use client';

import { useState, useEffect } from 'react';
import { MapPin, Target, Rocket, AlertTriangle, CheckCircle, Flag } from 'lucide-react';
import GraphVisualization from './components/GraphVisualization';

export default function Home() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [route, setRoute] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [nodes, setNodes] = useState<string[]>([]);
  const [groupedNodes, setGroupedNodes] = useState<Record<string, string[]>>({});
  const [loadingNodes, setLoadingNodes] = useState(true);
  const [allConnections, setAllConnections] = useState<any[]>([]);

  useEffect(() => {
    setLoadingNodes(true);
    fetch('/api/nodes')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setNodes(data.nodes || []);
        setGroupedNodes(data.grouped || {});
        setLoadingNodes(false);
      })
      .catch(err => {
        setError(`Error al cargar los nodos disponibles: ${err.message}. Por favor, recarga la página.`);
        setLoadingNodes(false);
      });
  }, []);

  const calculateRoute = async () => {
    setLoading(true);
    setError('');
    
    // Validaciones previas
    if (!start) {
      setError('Por favor selecciona un punto de inicio');
      setLoading(false);
      return;
    }
    
    if (end && start === end) {
      setError('El punto de inicio y destino no pueden ser el mismo');
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch('/api/r', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start, end: end || undefined }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error desconocido');
      }
      const data = await response.json();
      setRoute(data);
      setAllConnections(data.connections || []);
    } catch (err: any) {
      setError(err.message);
      setRoute(null);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 p-8 text-white">
          <h1 className="text-4xl font-bold mb-2 text-center">
            🚨 Sistema de Optimización de Rutas de Evacuación
          </h1>
          <p className="text-pink-100 text-center text-lg">
            Calcula la ruta más segura y eficiente usando algoritmos avanzados
          </p>
        </div>
        
        <div className="p-8">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Punto de Inicio
                </div>
                </label>
                <select
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 dark:bg-gray-700 dark:text-white transition-all duration-200"
                  disabled={loadingNodes}
                >
                  <option value="">
                    {loadingNodes ? 'Cargando nodos...' : 'Selecciona un punto de inicio'}
                  </option>
                  {Object.entries(groupedNodes).map(([type, nodeList]) => (
                    <optgroup key={type} label={type}>
                      {nodeList.map(node => (
                        <option key={node} value={node}>{node}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Punto de Destino
                </div>
                </label>
                <select
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 dark:bg-gray-700 dark:text-white transition-all duration-200"
                  disabled={loadingNodes}
                >
                  <option value="">
                    {loadingNodes ? 'Cargando nodos...' : 'Deja vacío para salida más cercana'}
                  </option>
                  {Object.entries(groupedNodes).map(([type, nodeList]) => (
                    <optgroup key={type} label={type}>
                      {nodeList.map(node => (
                        <option key={node} value={node}>{node}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>
            
            <button
              onClick={calculateRoute}
              disabled={loading || !start || loadingNodes}
              className="w-full bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Calculando ruta...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Rocket className="w-4 h-4" />
                  Calcular Ruta Óptima
                </div>
              )}
            </button>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                  <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
                </div>
              </div>
            )}
            
            {route && (
              <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-5 h-5 text-teal-600 dark:text-teal-400 mr-2" />
                  <h2 className="text-xl font-bold text-teal-800 dark:text-teal-200">Ruta Encontrada</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Costo Total</p>
                    <p className="text-2xl font-bold text-pink-600">{route.cost.toFixed(2)}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Nodos en Ruta</p>
                    <p className="text-2xl font-bold text-purple-600">{route.rutaLabels.length}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-gray-600 dark:border-gray-300 rounded" />
                    Ruta Detallada:
                  </h3>
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-inner">
                    <ol className="space-y-2">
                      {route.rutaLabels.map((label: string, idx: number) => (
                        <li key={idx} className="flex items-center">
                          <span className="bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3">
                            {idx + 1}
                          </span>
                          <span className="text-gray-700 dark:text-gray-300">{label}</span>
                          {idx === 0 && (
                            <div className="ml-2 text-green-600 flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              Inicio
                            </div>
                          )}
                          {idx === route.rutaLabels.length - 1 && (
                            <div className="ml-2 text-red-600 flex items-center gap-1">
                              <Flag className="w-4 h-4" />
                              Fin
                            </div>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            )}
            
            {route && route.rutaLabels && allConnections.length > 0 && (
              <div className="mt-6">
                <GraphVisualization
                  route={route.rutaLabels}
                  allConnections={allConnections}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
