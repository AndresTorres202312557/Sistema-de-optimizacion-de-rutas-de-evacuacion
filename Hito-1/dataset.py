from collections import defaultdict
import pandas as pd

def leer_dataset_excel(path_excel: str) -> pd.DataFrame:
    df = pd.read_excel(path_excel)

    alias = {
        "Nodo_origen": ["Nodo_origen","Origen","Nodo origen"],
        "Nodo_destino": ["Nodo_destino","Destino","Nodo destino"],
        "Tipo_conexion": ["Tipo_conexion","Tipo","Tipo conexion"],
        "Piso_origen": ["Piso_origen","Piso Origen","Piso de origen"],
        "Piso_destino": ["Piso_destino","Piso Destino","Piso de destino"],
        "Distancia_m": ["Distancia_m","Distancia","Distancia (m)"],
        "Altura_m": ["Altura_m","Altura","Altura (m)"],
        "Factor_congestion": ["Factor_congestion","Factor","Factor congestion"],
        "Peso_total": ["Peso_total","Peso","Peso total"],
    }

    cols = [str(c).strip() for c in df.columns]
    df.columns = cols

    colmap = {}
    for target, opts in alias.items():
        for opt in opts:
            for c in cols:
                if opt.lower().replace(" ","_")==c.lower().replace(" ","_"):
                    colmap[c]=target
    df = df.rename(columns=colmap)

    # Si no hay altura, la ponemos en cero
    if "Altura_m" not in df.columns:
        df["Altura_m"] = 0.0

    return df

excel_path = "dataset_tp_complejidad.xlsx"
df = leer_dataset_excel(excel_path)
print("Columnas detectadas:", list(df.columns))
print("Filas:", len(df))
df.head(3)
