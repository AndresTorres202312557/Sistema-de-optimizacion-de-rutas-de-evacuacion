import pandas as pd
from collections import defaultdict
from dataset import df

def peso_integrado(dist, alt, factor, peso_total=None):
    if pd.notna(peso_total):
        return float(peso_total)
    dist  = 0.0 if pd.isna(dist) else float(dist)
    alt   = 0.0 if pd.isna(alt) else float(alt)
    factor= 1.0 if pd.isna(factor) else float(factor)
    return (dist + alt) * factor

def _tipo(n):
    s = str(n).lower()
    if "aula" in s: return "Aula"
    if "pasillo" in s: return "Pasillo"
    if "escala" in s: return "Escalera"
    if "salida" in s: return "Salida"
    return "Otro"

def construir_ady(df: pd.DataFrame):
    labels, w2i = [], {}
    tipos = {}
    pisos_nodo = defaultdict(set)

    def idx(name):
        name = str(name)
        if name not in w2i:
            w2i[name] = len(labels)
            labels.append(name)
        return w2i[name]

    edges = []
    for _, r in df.iterrows():
        u = idx(r["Nodo_origen"])
        v = idx(r["Nodo_destino"])
        w = peso_integrado(r["Distancia_m"], r["Altura_m"], r["Factor_congestion"], r.get("Peso_total", None))
        tipos.setdefault(labels[u], _tipo(labels[u]))
        tipos.setdefault(labels[v], _tipo(labels[v]))
        pisos_nodo[labels[u]].add(r["Piso_origen"])
        pisos_nodo[labels[v]].add(r["Piso_destino"])
        edges.append((u,v,float(w)))

    G = [[] for _ in range(len(labels))]
    for u,v,w in edges:
        G[u].append((v,w))
    return G, labels, w2i, tipos, pisos_nodo

G, labels, w2i, tipos_nodo, pisos_nodo = construir_ady(df)
print("Nodos únicos:", len(labels))
print("Aristas:", sum(len(L) for L in G))
