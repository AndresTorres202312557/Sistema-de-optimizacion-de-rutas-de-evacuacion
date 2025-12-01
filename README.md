# Sistema de Optimización de Rutas de Evacuación

Un sistema web interactivo que calcula rutas óptimas de evacuación en edificios utilizando el algoritmo de Dijkstra. Desarrollado con Next.js y TypeScript.

## 🚀 Características

- **Algoritmo de Dijkstra**: Implementación optimizada para encontrar la ruta más segura y eficiente
- **Visualización Interactiva**: Grafo visual que muestra el edificio con 4 pisos, aulas, pasillos y escaleras
- **Interfaz Intuitiva**: Selección fácil de punto de inicio y destino
- **Análisis Detallado**: Información completa sobre la ruta calculada, incluyendo costo total y número de nodos
- **Responsive Design**: Compatible con diferentes tamaños de pantalla

## 📋 Requisitos Previos

Antes de ejecutar el programa, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** (viene incluido con Node.js)

## 🛠️ Pasos para Ejecutar el Programa

### 1. Clonar el Repositorio
```bash
git clone https://github.com/AndresTorres202312557/Sistema-de-optimizacion-de-rutas-de-evacuacion.git
cd Sistema-de-optimizacion-de-rutas-de-evacuacion
```

### 2. Navegar al Directorio del Proyecto
```bash
cd "Código fuente"
```

### 3. Instalar Dependencias
```bash
npm install
```

### 4. Ejecutar el Servidor de Desarrollo
```bash
npm run dev
```

### 5. Abrir en el Navegador
Una vez que el servidor esté ejecutándose, abre tu navegador web y ve a:
```
http://localhost:3000
```

## 🎯 Cómo Usar el Sistema

1. **Seleccionar Punto de Inicio**: Elige una aula, pasillo o escalera como punto de partida
2. **Seleccionar Destino (Opcional)**: Puedes elegir un destino específico o dejar vacío para encontrar la salida más cercana
3. **Calcular Ruta**: Haz clic en "Calcular Ruta Óptima"
4. **Visualizar Resultado**: El sistema mostrará:
   - Grafo visual con la ruta marcada
   - Costo total de la ruta
   - Número de nodos en el recorrido
   - Lista detallada paso a paso
   - Información estadística de la evacuación

## 🏗️ Estructura del Proyecto

```
sore/
├── dataset/
│   ├── dataset-1000-limpio.json     # Dataset principal con 1000+ conexiones
│   ├── dataset-final-limpio.json    # Dataset de respaldo
│   ├── dataset_tp_complejidad.xlsx  # Dataset original en Excel
│   ├── dataset.py                   # Script de procesamiento de datos
│   ├── dijkstra.py                  # Implementación Python del algoritmo
│   └── nodos_aristas.py            # Utilidades para manejo de grafos
├── Código fuente/
│   ├── app/
│   │   ├── components/
│   │   │   └── GraphVisualization.tsx    # Componente de visualización del grafo
│   │   ├── lib/
│   │   │   ├── data.ts                   # Carga y procesamiento de datos
│   │   │   ├── dijkstra.ts              # Implementación del algoritmo de Dijkstra
│   │   │   └── graph.ts                 # Construcción y manejo del grafo
│   │   ├── api/
│   │   │   ├── nodes/                   # API para obtener nodos disponibles
│   │   │   └── r/                       # API para calcular rutas
│   │   ├── globals.css                  # Estilos globales
│   │   ├── layout.tsx                   # Layout principal
│   │   └── page.tsx                     # Página principal
│   ├── package.json
│   ├── next.config.ts
└── README.md
```

## 🎨 Tecnologías Utilizadas

- **Frontend**: Next.js 16, React, TypeScript
- **Estilos**: Tailwind CSS
- **Algoritmos**: Dijkstra para búsqueda de caminos óptimos
- **Visualización**: SVG para renderizado del grafo
- **Icons**: Lucide React

## 📊 Dataset

El sistema utiliza un dataset con más de 1000 conexiones entre:
- **Aulas**: Numeradas del 100-499 distribuidas en 4 pisos
- **Pasillos**: Conectores principales entre aulas
- **Escaleras**: Conexiones verticales entre pisos
- **Salidas**: Puntos de evacuación del edificio

## 🔧 Comandos Adicionales

```bash
# Construir para producción
npm run build

# Ejecutar en modo producción
npm start

# Verificar lint
npm run lint
```

---