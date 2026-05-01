from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Dict, Any
from .gatekeeper import verify_antigravity_credits

app = FastAPI(
    title="Hacke's Jobs - AI Engine",
    description="Microservicio de IA Semántica y Evaluaciones CAT para Hacke's Jobs v2.0",
    version="2.0.0"
)

class CVProcessingRequest(BaseModel):
    tenant_id: str
    cv_url: str
    job_description: str

from .cat_engine import calculate_standard_error, select_next_item, update_theta_mle

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "ai-engine"}

class CatStartRequest(BaseModel):
    available_items: list[Dict[str, Any]]
    current_theta: float = 0.0

@app.post("/api/cat/start")
async def start_cat_session(request: CatStartRequest):
    if not request.available_items:
        raise HTTPException(status_code=400, detail="No items provided")
        
    next_item = select_next_item(request.available_items, request.current_theta)
    
    return {
        "status": "success",
        "next_item": next_item
    }

class CatAnswerRequest(BaseModel):
    history: list[Dict[str, Any]]
    current_theta: float
    available_items: list[Dict[str, Any]]

@app.post("/api/cat/answer")
async def answer_cat_item(request: CatAnswerRequest):
    # 1. Recalcular Theta y SE basado en el historial
    new_theta = update_theta_mle(request.history, request.current_theta)
    se = calculate_standard_error(request.history, new_theta)
    
    # 2. Criterio de parada: Error Estandar < 0.3 o demasiadas preguntas (ej. 20)
    if se < 0.3 or len(request.history) >= 20:
        return {"status": "completed", "final_theta": new_theta, "standard_error": se}
    
    # 3. Si no hemos terminado, seleccionar el siguiente ítem
    next_item = select_next_item(request.available_items, new_theta)
    
    return {
        "status": "in_progress",
        "new_theta": new_theta,
        "standard_error": se,
        "next_item": next_item
    }

from .nlp_pipeline import extract_structured_cv, create_embeddings, store_candidate_vector, match_candidates

@app.post("/api/v1/process-cv")
async def process_cv(request: CVProcessingRequest):
    # Paso 1: Gatekeeper Check
    has_credits = verify_antigravity_credits(request.tenant_id)
    if not has_credits:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Créditos insuficientes en Antigravity para ejecutar este proceso."
        )
    
    # Mock text del CV (en realidad se descargaría request.cv_url y se pasaría por OCR/PDF parser)
    raw_cv_text = "Desarrollador con 4 años de experiencia en React y Python..."
    
    # Paso 2: NER Structuring
    structured_data = extract_structured_cv(raw_cv_text)
    
    # Paso 3: Vectorization
    cv_vector = create_embeddings(str(structured_data))
    
    # Paso 4: Almacenamiento en Vector DB (Pinecone)
    candidate_id = "mock_cuid_123"
    store_candidate_vector(request.tenant_id, candidate_id, cv_vector, structured_data)
    
    return {
        "status": "success",
        "extracted_data": structured_data,
        "message": "CV procesado exitosamente y almacenado en Vector DB."
    }

class MatchRequest(BaseModel):
    tenant_id: str
    job_description: str
    top_k: int = 5

@app.post("/api/v1/match-candidates")
async def rank_candidates(request: MatchRequest):
    # Paso 1: Vectorizar la descripción del puesto
    jd_vector = create_embeddings(request.job_description)
    
    # Paso 2: Búsqueda Semántica en Pinecone
    matches = match_candidates(request.tenant_id, jd_vector, request.top_k)
    
    return {
        "status": "success",
        "matches": matches
    }
