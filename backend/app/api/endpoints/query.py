from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.user import User
from app.models.query import QueryHistory
from app.schemas.query import QueryRequest, QueryResponse, ExecuteRequest, ExecuteResponse, QueryHistoryResponse
from app.api import deps
from app.services.ai import AIService
from app.services.safety import SafetyChecker
from app.services.executor import QueryExecutor

router = APIRouter()

@router.post("/generate", response_model=QueryResponse)
def generate_sql(
    request: QueryRequest,
    current_user: User = Depends(deps.get_current_user)
):
    try:
        sql = AIService.generate_sql(request.natural_language)
        return {"sql_query": sql}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/execute", response_model=ExecuteResponse)
def execute_sql(
    request: ExecuteRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    # Get user permissions
    allowed_perms = [p.permission for p in current_user.role.permissions]
    
    # 1. Safety Check
    if not SafetyChecker.is_safe(request.sql_query, allowed_perms):
        # Log failed query
        history = QueryHistory(
            user_id=current_user.id,
            query_text=request.sql_query,
            status="failed",
            result_rows=0
        )
        db.add(history)
        db.commit()
        raise HTTPException(
            status_code=400, 
            detail="Safety check failed: This query contains operations not permitted by your role."
        )
        
    # 2. Execute Query
    status, rows, data, error = QueryExecutor.execute(db, request.sql_query)
    
    # 3. Log History
    history = QueryHistory(
        user_id=current_user.id,
        query_text=request.sql_query,
        status=status,
        result_rows=rows
    )
    db.add(history)
    db.commit()
    
    if status == "failed":
        raise HTTPException(status_code=400, detail=f"Query execution failed: {error}")
        
    return {
        "status": status,
        "result_rows": rows,
        "data": data
    }

@router.get("/history", response_model=List[QueryHistoryResponse])
def get_query_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    history = db.query(QueryHistory).filter(QueryHistory.user_id == current_user.id).order_by(QueryHistory.execution_time.desc()).all()
    return history
