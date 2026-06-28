from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Dict, Any, Tuple, List
import logging

logger = logging.getLogger(__name__)

class QueryExecutor:
    @staticmethod
    def execute(db: Session, sql_query: str) -> Tuple[str, int, List[Dict[str, Any]], str]:
        """
        Executes a SQL query against the database using SQLAlchemy.
        Returns: (status, result_rows, data, error_message)
        """
        try:
            result = db.execute(text(sql_query))
            
            # If it's a SELECT query, it will return rows
            if result.returns_rows:
                columns = result.keys()
                rows = result.fetchall()
                data = [dict(zip(columns, row)) for row in rows]
                return ("success", len(data), data, None)
            else:
                # INSERT, UPDATE, DELETE
                db.commit()
                return ("success", result.rowcount, [], None)
                
        except Exception as e:
            db.rollback()
            logger.error(f"Error executing query: {str(e)}")
            return ("failed", 0, [], str(e))
