# Dijkstra algorithm for evacuation routes
import math
import heapq as hq

def dijkstra(G, start):
    n = len(G)
    dist = [math.inf] * n
    parent = [-1] * n
    dist[start] = 0
    
    pq = [(0, start)]
    
    while pq:
        d, u = hq.heappop(pq)
        if d > dist[u]:
            continue
        
        for v, weight in G[u]:
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                parent[v] = u
                hq.heappush(pq, (dist[v], v))
    
    return parent, dist

def reconstruir(parent, goal):
    if goal is None or parent[goal] == -1:
        return None
    
    path = []
    current = goal
    while current != -1:
        path.append(current)
        current = parent[current]
    
    return path[::-1]

def calcular_ruta(G, labels, w2i, tipos_nodo, start_label, end_label=None):
    """Calculate route from start to end using Dijkstra"""
    if start_label not in w2i:
        return None, None, None, None
    
    start = w2i[start_label]
    parent, dist = dijkstra(G, start)
    
    if end_label:
        if end_label not in w2i:
            return None, None, None, None
        goal = w2i[end_label]
        if dist[goal] == math.inf:
            return None, None, None, None
        ruta_idx = reconstruir(parent, goal)
        cost = dist[goal]
    else:
        # Find nearest exit
        exits_idx = {w2i[n] for n,t in tipos_nodo.items() if t=="Salida" and n in w2i}
        goal = None
        if exits_idx:
            candidatos = [(e, dist[e]) for e in exits_idx if dist[e] < math.inf]
            if candidatos:
                goal = min(candidatos, key=lambda x: x[1])[0]
        if goal is None:
            return None, None, None, None
        ruta_idx = reconstruir(parent, goal)
        cost = dist[goal]
    
    return start, goal, cost, ruta_idx