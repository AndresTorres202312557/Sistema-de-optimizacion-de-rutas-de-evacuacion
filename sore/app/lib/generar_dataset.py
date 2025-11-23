import json
import random

# Generar dataset de 1000 conexiones con nombres básicos
dataset = []

# Conexiones de aulas (500 conexiones)
for i in range(100, 600):
    piso = ((i - 100) % 5) + 1
    pasillo = 1 + ((i - 100) % 80)
    distancia = 5 + (i % 15)
    congestion = round(1.0 + ((i % 10) * 0.1), 1)
    peso = round(distancia * congestion, 2)
    
    dataset.append({
        "Nodo_origen": f"Aula_{i}",
        "Nodo_destino": f"Pasillo_{pasillo}",
        "Tipo_conexion": "Puerta",
        "Piso_origen": piso,
        "Piso_destino": piso,
        "Distancia_m": distancia,
        "Factor_congestion": congestion,
        "Peso_total": peso
    })

# Conexiones entre pasillos (350 conexiones)
for i in range(1, 351):
    piso = (i % 5) + 1
    pasillo2 = i + 20
    if pasillo2 > 100:
        pasillo2 = (i % 80) + 1
    
    distancia = 8 + (i % 20)
    congestion = round(1.1 + ((i % 8) * 0.1), 1)
    peso = round(distancia * congestion, 2)
    
    dataset.append({
        "Nodo_origen": f"Pasillo_{i}",
        "Nodo_destino": f"Pasillo_{pasillo2}",
        "Tipo_conexion": "Pasillo",
        "Piso_origen": piso,
        "Piso_destino": piso,
        "Distancia_m": distancia,
        "Factor_congestion": congestion,
        "Peso_total": peso
    })

# Conexiones de escaleras (148 conexiones)
for i in range(1, 149):
    piso1 = (i % 4) + 1
    piso2 = (piso1 % 5) + 1
    pasillo = 5 + (i % 70)
    
    distancia = 10 + (i % 8)
    congestion = round(1.3 + ((i % 6) * 0.1), 1)
    peso = round(distancia * congestion, 2)
    
    dataset.append({
        "Nodo_origen": f"Escalera_{i}",
        "Nodo_destino": f"Pasillo_{pasillo}",
        "Tipo_conexion": "Escalera",
        "Piso_origen": piso1,
        "Piso_destino": piso2,
        "Distancia_m": distancia,
        "Factor_congestion": congestion,
        "Peso_total": peso
    })

# Conexiones a salidas (2 conexiones)
dataset.append({
    "Nodo_origen": "Pasillo_10",
    "Nodo_destino": "Salida_Principal",
    "Tipo_conexion": "Pasillo",
    "Piso_origen": 1,
    "Piso_destino": 1,
    "Distancia_m": 20,
    "Factor_congestion": 1.0,
    "Peso_total": 20.0
})

dataset.append({
    "Nodo_origen": "Pasillo_25",
    "Nodo_destino": "Salida_Emergencia",
    "Tipo_conexion": "Pasillo",
    "Piso_origen": 1,
    "Piso_destino": 1,
    "Distancia_m": 25,
    "Factor_congestion": 1.0,
    "Peso_total": 25.0
})

print(f"Dataset generado con {len(dataset)} conexiones")

# Guardar el dataset
with open('dataset-1000-limpio.json', 'w', encoding='utf-8') as f:
    json.dump(dataset, f, indent=2, ensure_ascii=False)

print("Archivo dataset-1000-limpio.json creado exitosamente")