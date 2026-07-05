import logging

import google.generativeai as genai

from app.core.config import settings

logger = logging.getLogger(__name__)

# Configure Gemini only when an API key is available.
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-2.5-flash")
else:
    model = None

class AIService:
    @staticmethod
    def get_database_schema() -> str:
        # For now, hardcode the schema or read from a defined place.
        # In a real app, you could reflect the SQLAlchemy engine.
        return """
        Table: users (id INT, email VARCHAR, first_name VARCHAR, last_name VARCHAR, role_id INT, is_active BOOLEAN)
        Table: roles (id INT, name VARCHAR, description VARCHAR)
        Table: permissions (id INT, role_id INT, permission VARCHAR)
        Table: query_history (id INT, user_id INT, query_text TEXT, execution_time DATETIME, status VARCHAR, result_rows INT)
        """

    @staticmethod
    def generate_sql(user_question: str) -> str:
        if model is None:
            raise RuntimeError("Gemini API key is not configured. Set GEMINI_API_KEY to enable SQL generation.")

        schema = AIService.get_database_schema()
        
        prompt = f"""
        You are an expert MySQL SQL generator.

        Database Schema:
        {schema}

        Rules:
        1. Generate ONLY standard MySQL queries.
        2. Do NOT generate explanations.
        3. Do NOT generate markdown.
        4. Do NOT generate code blocks.
        5. Return only SQL.
        6. Use only columns from the schema.

        Question:
        {user_question}
        """

        try:
            response = model.generate_content(prompt)
            sql_query = response.text.strip()
            
            # Clean up potential markdown formatting
            sql_query = sql_query.replace("```sql", "").replace("```", "").strip()
            return sql_query
        except Exception as e:
            logger.error(f"Error generating SQL via Gemini: {str(e)}")
            raise e
