import re
from typing import List
from app.models.role import Role

class SafetyChecker:
    @staticmethod
    def is_safe(sql_query: str, allowed_permissions: List[str]) -> bool:
        """
        Validates whether the incoming SQL query matches the permissions
        allowed for the current user's role.
        """
        # Clean and uppercase
        sql_upper = sql_query.strip().upper()
        
        # Very rudimentary operation extraction
        # Real-world apps should use an SQL parser like sqlparse
        operation = sql_upper.split()[0] if sql_upper else ""
        
        # Some normalizations for SELECT vs SHOW vs DESCRIBE
        if operation in ["SHOW", "DESCRIBE", "EXPLAIN"]:
            operation = "SELECT"
            
        if operation not in allowed_permissions:
            return False
            
        # Additional deep check for completely destructive operations just in case
        dangerous_keywords = ["DROP", "TRUNCATE", "ALTER"]
        if any(keyword in allowed_permissions for keyword in dangerous_keywords):
            # If they are allowed to DROP, they are an admin, so let them through
            return True
            
        # Otherwise, ensure no dangerous keywords sneak in as subqueries
        for keyword in dangerous_keywords:
            if re.search(r'\b' + keyword + r'\b', sql_upper):
                return False
                
        return True
