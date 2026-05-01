import os
from typing import Dict, Any, List
from openai import OpenAI
from pinecone import Pinecone

# Inicialización de clientes (Depende de variables de entorno)
# OPENAI_API_KEY y PINECONE_API_KEY deben estar en el .env
openai_client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY", "mock-key"))
pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY", "mock-key"))
index_name = "hackes-jobs-index"

def extract_structured_cv(raw_text: str) -> Dict[str, Any]:
    """
    Paso 1: NER (Named Entity Recognition)
    Usa OpenAI para extraer y estructurar el contenido del CV.
    """
    import json
    if os.environ.get("OPENAI_API_KEY", "mock-key") == "mock-key":
        print("[Mock] Retornando estructura de CV extraída (NER)")
        return {
            "skills": ["Python", "FastAPI", "React", "PostgreSQL"],
            "experience_years": 4,
            "education": "Ingeniería de Software"
        }
        
    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an expert HR assistant. Extract skills, experience years, and education from the CV. Return JSON with keys: skills, experience_years, education."},
                {"role": "user", "content": raw_text}
            ],
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"[Error NLP] Fallo en la extracción: {e}")
        raise

def create_embeddings(text: str) -> List[float]:
    """
    Paso 2: Vectorización
    Convierte el texto en un vector numérico usando text-embedding-3-small.
    """
    if os.environ.get("OPENAI_API_KEY", "mock-key") == "mock-key":
        return [0.015] * 1536
        
    try:
        response = openai_client.embeddings.create(
            input=text,
            model="text-embedding-3-small"
        )
        return response.data[0].embedding
    except Exception as e:
        print(f"[Error Vectorization] Fallo al crear embeddings: {e}")
        raise

def store_candidate_vector(tenant_id: str, candidate_id: str, vector: List[float], metadata: Dict[str, Any]):
    """
    Paso 3: Almacenamiento en Pinecone
    Guarda el vector asegurando el namespace del tenant para multi-tenancy.
    """
    if os.environ.get("PINECONE_API_KEY", "mock-key") == "mock-key":
        print(f"[Mock Pinecone] Vector guardado para {candidate_id} del tenant {tenant_id}")
        return
        
    try:
        index = pc.Index(index_name)
        index.upsert(
           vectors=[{
               "id": candidate_id,
               "values": vector,
               "metadata": {"tenant_id": tenant_id, **metadata}
           }],
           namespace=tenant_id
        )
        print(f"[Pinecone] Vector guardado para {candidate_id} del tenant {tenant_id}")
    except Exception as e:
        print(f"[Error Pinecone] No se pudo guardar el vector: {e}")
        raise

def match_candidates(tenant_id: str, job_description_vector: List[float], top_k: int = 5) -> List[Dict[str, Any]]:
    """
    Paso 4: Búsqueda Semántica
    Calcula similitud coseno entre la vacante y los candidatos.
    """
    if os.environ.get("PINECONE_API_KEY", "mock-key") == "mock-key":
        return [
            {"id": "cand_1", "score": 0.92, "metadata": {"name": "Carlos Dev"}},
            {"id": "cand_2", "score": 0.85, "metadata": {"name": "Ana Frontend"}},
            {"id": "cand_3", "score": 0.78, "metadata": {"name": "Luis Backend"}},
        ]
        
    try:
        index = pc.Index(index_name)
        result = index.query(
            namespace=tenant_id,
            vector=job_description_vector,
            top_k=top_k,
            include_metadata=True
        )
        return result.matches
    except Exception as e:
        print(f"[Error Pinecone] Búsqueda fallida: {e}")
        raise
