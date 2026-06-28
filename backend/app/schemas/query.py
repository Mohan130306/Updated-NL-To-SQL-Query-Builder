from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class QueryRequest(BaseModel):
    natural_language: str

class QueryResponse(BaseModel):
    sql_query: str

class ExecuteRequest(BaseModel):
    sql_query: str

class ExecuteResponse(BaseModel):
    status: str
    result_rows: int
    data: List[Dict[str, Any]]
    error: Optional[str] = None

class QueryHistoryResponse(BaseModel):
    id: int
    query_text: str
    execution_time: datetime
    status: str
    result_rows: Optional[int]

    model_config = {"from_attributes": True}
